using VehicleMarketplace.Domain.Common;

namespace VehicleMarketplace.Domain.Entities;

public class Conversation : BaseEntity
{
    public string? ListingId { get; set; }
    public VehicleListing? Listing { get; set; }
    
    public string BuyerId { get; set; } = string.Empty;
    public ApplicationUser Buyer { get; set; } = null!;
    
    public string SellerId { get; set; } = string.Empty;
    public ApplicationUser Seller { get; set; } = null!;
    
    public DateTime LastMessageAt { get; set; }
    public bool IsBuyerRead { get; set; }
    public bool IsSellerRead { get; set; }
    
    // Support conversation flag
    public bool IsSupportConversation { get; set; }
    public string? SupportUserId { get; set; }
    public ApplicationUser? SupportUser { get; set; }
    
    public ICollection<Message> Messages { get; set; } = new List<Message>();
}
