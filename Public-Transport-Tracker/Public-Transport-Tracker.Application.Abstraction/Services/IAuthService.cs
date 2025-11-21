using Public_Transport_Tracker.Domain.Entities;

namespace Public_Transport_Tracker.Application.Abstraction.Services
{
    public interface IAuthService
    {
        Task<(bool Success, string? Token, User? User, string? Error)> LoginAsync(string email, string password);
        Task<(bool Success, string? Token, User? User, string? Error)> RegisterAsync(string name, string email, string password, string phone, string role);
        Task<User?> GetUserByEmailAsync(string email);
    }
}





