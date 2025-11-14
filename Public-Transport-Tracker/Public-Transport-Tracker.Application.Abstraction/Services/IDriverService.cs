using Public_Transport_Tracker.Domain.Entities;

namespace Public_Transport_Tracker.Application.Abstraction.Services
{
    public interface IDriverService
    {
        Task<bool> UpdateLocationAsync(Guid busId, double latitude, double longitude, double heading);
        Task<bool> StartTripAsync(Guid busId, Guid driverId);
        Task<bool> EndTripAsync(Guid busId);
        Task<bool> ReportIssueAsync(Guid busId, string issueType, string description);
        Task<bool> RecordStationAsync(Guid busId, string stationName);
    }
}
