using VehicleMarketplace.Domain.Common;

namespace VehicleMarketplace.Domain.Entities;

public enum PaymentStatus
{
    Pending,
    Success,
    Failed,
    Refunded
}

public enum PaymentType
{
    PremiumListing,
    FeaturedListing,
    SubscriptionMonthly,
    SubscriptionYearly
}

public class Payment : BaseEntity
{
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    
    public string? ListingId { get; set; }
    public VehicleListing? Listing { get; set; }
    
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "ZAR";
    
    public PaymentType Type { get; set; }
    public PaymentStatus Status { get; set; }
    
    // Paystack fields
    public string? PaystackReference { get; set; }
    public string? PaystackAccessCode { get; set; }
    public string? PaystackAuthorizationUrl { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    
    public string? FailureReason { get; set; }
}
