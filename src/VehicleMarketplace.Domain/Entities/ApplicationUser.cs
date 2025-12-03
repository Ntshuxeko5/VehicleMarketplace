using Microsoft.AspNetCore.Identity;

namespace VehicleMarketplace.Domain.Entities;

public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    
    // Premium features
    public bool IsPremium { get; set; }
    public DateTime? PremiumExpiresAt { get; set; }
    
    // Messaging
    public ICollection<Conversation> BuyerConversations { get; set; } = new List<Conversation>();
    public ICollection<Conversation> SellerConversations { get; set; } = new List<Conversation>();
    public ICollection<Conversation> SupportConversations { get; set; } = new List<Conversation>();
    public ICollection<Message> Messages { get; set; } = new List<Message>();
    
    // Payments
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
