using Public_Transport_Tracker.Domain.Entities;

namespace Public_Transport_Tracker.Application.Abstraction.Services
{
    public interface IRouteService
    {
        Task<IEnumerable<Route>> GetAllRoutesAsync();
        Task<Route?> GetRouteByIdAsync(Guid id);
        Task<Route> CreateRouteAsync(string routeName, string busNumber, string stops, string startTime, string endTime, string frequency);
        Task<bool> UpdateRouteAsync(Guid id, string? routeName, string? busNumber, string? stops, string? startTime, string? endTime, string? frequency);
        Task<bool> DeleteRouteAsync(Guid id);
    }
}
