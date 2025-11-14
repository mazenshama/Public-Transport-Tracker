using Public_Transport_Tracker.Domain.Entities;

namespace Public_Transport_Tracker.Application.Abstraction.Services
{
    public interface IBusService
    {
        Task<IEnumerable<Bus>> GetAllBusesAsync();
        Task<Bus?> GetBusByIdAsync(Guid id);
        Task<Bus> CreateBusAsync(string number, int capacity, string? routeName);
        Task<bool> UpdateBusAsync(Guid id, string? number, int? capacity, string? status);
        Task<bool> DeleteBusAsync(Guid id);
    }
}
