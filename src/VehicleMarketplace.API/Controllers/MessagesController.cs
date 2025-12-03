using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VehicleMarketplace.Infrastructure.Persistence;
using VehicleMarketplace.Domain.Entities;
using System.Security.Claims;

namespace VehicleMarketplace.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MessagesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    
    public MessagesController(ApplicationDbContext context)
    {
        _context = context;
    }
    
    [HttpGet("conversations")]
    public async Task<IActionResult> GetConversations()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        var conversations = await _context.Conversations
            .Include(c => c.Listing)
            .Include(c => c.Buyer)
            .Include(c => c.Seller)
            .Where(c => c.BuyerId == userId || c.SellerId == userId || c.SupportUserId == userId)
            .OrderByDescending(c => c.LastMessageAt)
            .Select(c => new
            {
                c.Id,
                c.ListingId,
                Listing = c.Listing != null ? new { c.Listing.Id, c.Listing.Title } : null,
                Buyer = new { c.Buyer.Id, c.Buyer.FirstName, c.Buyer.LastName },
                Seller = new { c.Seller.Id, c.Seller.FirstName, c.Seller.LastName },
                c.LastMessageAt,
                UnreadCount = c.Messages.Count(m => !m.IsRead && m.SenderId != userId)
            })
            .ToListAsync();
            
        return Ok(conversations);
    }
    
    [HttpPost("conversations")]
    public async Task<IActionResult> CreateConversation([FromBody] CreateConversationRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        
        // Check if conversation already exists
        var existing = await _context.Conversations
            .FirstOrDefaultAsync(c => c.ListingId == request.ListingId && 
                                     c.BuyerId == userId && 
                                     c.SellerId == request.SellerId);
        
        if (existing != null)
        {
            return Ok(new { id = existing.Id });
        }
        
        var conversation = new Conversation
        {
            Id = Guid.NewGuid().ToString(),
            ListingId = request.ListingId,
                BuyerId = userId,
            SellerId = request.SellerId,
            IsSupportConversation = request.IsSupport,
            LastMessageAt = DateTime.UtcNow
        };
        
        _context.Conversations.Add(conversation);
        await _context.SaveChangesAsync();
        
        return Ok(new { id = conversation.Id });
    }
    
    [HttpGet("conversations/{id}/messages")]
    public async Task<IActionResult> GetMessages(string id)
    {
        var messages = await _context.Messages
            .Include(m => m.Sender)
            .Where(m => m.ConversationId == id)
            .OrderBy(m => m.SentAt)
            .Select(m => new
            {
                m.Id,
                m.Content,
                m.SentAt,
                m.IsRead,
                Sender = new { m.Sender.Id, m.Sender.FirstName, m.Sender.LastName }
            })
            .ToListAsync();
            
        return Ok(messages);
    }
    
    [HttpPost("conversations/{id}/messages")]
    public async Task<IActionResult> SendMessage(string id, [FromBody] SendMessageRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        
        var message = new Message
        {
            Id = Guid.NewGuid().ToString(),
            ConversationId = id,
            SenderId = userId,
            Content = request.Content,
            SentAt = DateTime.UtcNow,
            IsRead = false
        };
        
        _context.Messages.Add(message);
        
        var conversation = await _context.Conversations.FindAsync(id);
        if (conversation != null)
        {
            conversation.LastMessageAt = DateTime.UtcNow;
        }
        
        await _context.SaveChangesAsync();
        
        return Ok(new { id = message.Id });
    }
    
    [HttpPatch("conversations/{id}/read")]
    public async Task<IActionResult> MarkAsRead(string id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        
        var messages = await _context.Messages
            .Where(m => m.ConversationId == id && m.SenderId != userId && !m.IsRead)
            .ToListAsync();
            
        foreach (var message in messages)
        {
            message.IsRead = true;
        }
        
        await _context.SaveChangesAsync();
        
        return Ok();
    }
}

public record CreateConversationRequest(string? ListingId, string SellerId, bool IsSupport = false);
public record SendMessageRequest(string Content);
