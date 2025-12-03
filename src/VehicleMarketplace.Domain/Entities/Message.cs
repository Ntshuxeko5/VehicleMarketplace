using VehicleMarketplace.Domain.Common;

namespace VehicleMarketplace.Domain.Entities;

public class Message : BaseEntity
{
    public string ConversationId { get; set; } = string.Empty;
    public Conversation Conversation { get; set; } = null!;
    
    public string SenderId { get; set; } = string.Empty;
    public ApplicationUser Sender { get; set; } = null!;
    
    public string Content { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime SentAt { get; set; }
    
    // Attachments support
    public string? AttachmentUrl { get; set; }
    public string? AttachmentType { get; set; }
}
