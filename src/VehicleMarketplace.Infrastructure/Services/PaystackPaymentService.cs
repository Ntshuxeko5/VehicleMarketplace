using PayStack.Net;
using Microsoft.Extensions.Configuration;

namespace VehicleMarketplace.Infrastructure.Services;

public interface IPaymentService
{
    Task<(string authUrl, string reference)> InitializePayment(decimal amount, string email, string userId);
    Task<bool> VerifyPayment(string reference);
}

public class PaystackPaymentService : IPaymentService
{
    private readonly string _secretKey;
    private readonly PayStackApi _paystack;
    
    public PaystackPaymentService(IConfiguration config)
    {
        _secretKey = config["Paystack:SecretKey"] ?? "sk_test_placeholder";
        _paystack = new PayStackApi(_secretKey);
    }
    
    public async Task<(string authUrl, string reference)> InitializePayment(
        decimal amount, string email, string userId)
    {
        var reference = $"PM_{Guid.NewGuid():N}";
        
        var request = new TransactionInitializeRequest
        {
            AmountInKobo = (int)(amount * 100), // Convert to kobo (cents)
            Email = email,
            Reference = reference,
            Currency = "ZAR"
        };
        
        var response = await Task.Run(() => _paystack.Transactions.Initialize(request));
        
        return response.Status 
            ? (response.Data.AuthorizationUrl, reference)
            : throw new Exception($"Payment failed: {response.Message}");
    }
    
    public async Task<bool> VerifyPayment(string reference)
    {
        var response = await Task.Run(() => _paystack.Transactions.Verify(reference));
        return response.Status && response.Data.Status == "success";
    }
}
