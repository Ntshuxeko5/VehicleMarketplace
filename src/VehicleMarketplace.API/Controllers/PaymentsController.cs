using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VehicleMarketplace.Infrastructure.Services;
using VehicleMarketplace.Infrastructure.Persistence;
using VehicleMarketplace.Domain.Entities;
using System.Security.Claims;

namespace VehicleMarketplace.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;
    private readonly ApplicationDbContext _context;
    
    public PaymentsController(IPaymentService paymentService, ApplicationDbContext context)
    {
        _paymentService = paymentService;
        _context = context;
    }
    
    [HttpPost("initialize")]
    public async Task<IActionResult> InitializePayment([FromBody] InitializePaymentRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        var email = User.FindFirst(ClaimTypes.Email)?.Value!;
        
        var (authUrl, reference) = await _paymentService.InitializePayment(
            request.Amount, email, userId);
        
        // Save payment record
        var payment = new Payment
        {
            Id = Guid.NewGuid().ToString(),
            UserId = userId,
            ListingId = request.ListingId,
            Amount = request.Amount,
            Type = request.Type,
            Status = PaymentStatus.Pending,
            PaystackReference = reference,
            PaystackAuthorizationUrl = authUrl,
            CreatedAt = DateTime.UtcNow
        };
        
        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();
        
        return Ok(new { authUrl, reference, payment.Id });
    }
    
    [HttpPost("verify/{reference}")]
    public async Task<IActionResult> VerifyPayment(string reference)
    {
        var payment = await _context.Payments
            .FirstOrDefaultAsync(p => p.PaystackReference == reference);
            
        if (payment == null) 
            return NotFound();
        
        var isVerified = await _paymentService.VerifyPayment(reference);
        
        if (isVerified)
        {
            payment.Status = PaymentStatus.Success;
            payment.CompletedAt = DateTime.UtcNow;
            
            // Apply premium features based on payment type
            if (payment.Type is PaymentType.SubscriptionMonthly or PaymentType.SubscriptionYearly)
            {
                var user = await _context.Users.FindAsync(payment.UserId);
                if (user != null)
                {
                    user.IsPremium = true;
                    user.PremiumExpiresAt = payment.Type == PaymentType.SubscriptionMonthly
                        ? DateTime.UtcNow.AddMonths(1)
                        : DateTime.UtcNow.AddYears(1);
                }
            }
            
            // Apply listing upgrades
            if (payment.ListingId != null && 
                payment.Type is PaymentType.PremiumListing or PaymentType.FeaturedListing)
            {
                var listing = await _context.VehicleListings.FindAsync(Guid.Parse(payment.ListingId));
                if (listing != null)
                {
                    // You can add IsPremium, IsFeatured properties to VehicleListing entity
                    // listing.IsPremium = payment.Type == PaymentType.PremiumListing;
                    // listing.IsFeatured = payment.Type == PaymentType.FeaturedListing;
                }
            }
            
            await _context.SaveChangesAsync();
        }
        else
        {
            payment.Status = PaymentStatus.Failed;
            payment.FailureReason = "Payment verification failed";
            await _context.SaveChangesAsync();
        }
        
        return Ok(new { success = isVerified, payment });
    }
    
    [HttpGet("history")]
    public async Task<IActionResult> GetPaymentHistory()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        
        var payments = await _context.Payments
            .Include(p => p.Listing)
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new
            {
                p.Id,
                p.Amount,
                p.Type,
                p.Status,
                p.CreatedAt,
                p.CompletedAt,
                Listing = p.Listing != null ? new { p.Listing.Id, p.Listing.Title } : null
            })
            .ToListAsync();
            
        return Ok(payments);
    }
}

public record InitializePaymentRequest(decimal Amount, string? ListingId, PaymentType Type);
