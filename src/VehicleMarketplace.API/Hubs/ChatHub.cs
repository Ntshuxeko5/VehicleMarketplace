using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace VehicleMarketplace.API.Hubs;

[Authorize]
public class ChatHub : Hub
{
    private readonly ILogger<ChatHub> _logger;
    
    public ChatHub(ILogger<ChatHub> logger)
    {
        _logger = logger;
    }
    
    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        _logger.LogInformation($"User {userId} connected");
        await base.OnConnectedAsync();
    }
    
    public async Task JoinConversation(string conversationId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, conversationId);
        _logger.LogInformation($"User joined conversation: {conversationId}");
    }
    
    public async Task LeaveConversation(string conversationId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, conversationId);
    }
    
    public async Task SendMessage(string conversationId, string content)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        await Clients.Group(conversationId).SendAsync("ReceiveMessage", new
        {
            SenderId = userId,
            Content = content,
            SentAt = DateTime.UtcNow
        });
    }
    
    public async Task UserTyping(string conversationId, bool isTyping)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        await Clients.OthersInGroup(conversationId).SendAsync("UserTyping", new
        {
            UserId = userId,
            IsTyping = isTyping
        });
    }
}
