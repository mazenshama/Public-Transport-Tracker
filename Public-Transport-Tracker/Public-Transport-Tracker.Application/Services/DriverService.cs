using Microsoft.EntityFrameworkCore;
using Public_Transport_Tracker.Application.Abstraction.Services;
using Public_Transport_Tracker.Domain.Contracts;
using Public_Transport_Tracker.Domain.Entities;
using Public_Transport_Tracker.Persistence.Data;

namespace Public_Transport_Tracker.Application.Services
{
    public class DriverService : IDriverService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly PublicTransportTrackerContext _context;

        public DriverService(IUnitOfWork unitOfWork, PublicTransportTrackerContext context)
        {
            _unitOfWork = unitOfWork;
            _context = context;
        }

        public async Task<bool> UpdateLocationAsync(Guid busId, double latitude, double longitude, double heading)
        {
            try
            {
                // Load bus and its current driver (if needed for checks)
                var bus = await _context.Buses.FirstOrDefaultAsync(b => b.Id == busId);
                if (bus == null) return false;

                bus.CurrentLatitude = latitude;
                bus.CurrentLongitude = longitude;
                bus.CurrentHeading = heading;
                bus.LastLocationUpdate = DateTime.UtcNow;

                // Use UoW/Context consistency:
                _context.Buses.Update(bus);
                var savedChanges = await _context.SaveChangesAsync();

                return savedChanges > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error updating location: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> StartTripAsync(Guid busId, Guid driverId)
        {
            try
            {
                // Ensure bus and driver exist and the bus is available
                var bus = await _context.Buses.FirstOrDefaultAsync(b => b.Id == busId);
                var driver = await _unitOfWork.Drivers.GetByIdAsync(driverId);

                if (bus == null || driver == null || bus.Status != "available") return false;

                bus.Status = "active";
                bus.CurrentDriverId = driverId;

                // Note: The CurrentDriver navigation property is now set automatically by EF Core when CurrentDriverId is set.

                _context.Buses.Update(bus);
                var savedChanges = await _context.SaveChangesAsync();

                return savedChanges > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error starting trip: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> EndTripAsync(Guid busId)
        {
            try
            {
                var bus = await _context.Buses.FirstOrDefaultAsync(b => b.Id == busId);
                if (bus == null) return false;

                bus.Status = "available";
                bus.CurrentDriverId = null; // Remove driver assignment
                bus.CurrentLatitude = null;
                bus.CurrentLongitude = null;
                bus.CurrentHeading = null;

                _context.Buses.Update(bus);
                var savedChanges = await _context.SaveChangesAsync();

                return savedChanges > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error ending trip: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> ReportIssueAsync(Guid busId, string issueType, string description)
        {
            try
            {
                var bus = await _context.Buses.FirstOrDefaultAsync(b => b.Id == busId);
                if (bus == null) return false;

                bus.Status = "out-of-service";
                bus.CurrentDriverId = null; // Clear driver on issue report

                _context.Buses.Update(bus);
                var savedChanges = await _context.SaveChangesAsync();

                return savedChanges > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error reporting issue: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> RecordStationAsync(Guid busId, string stationName)
        {
            try
            {
                var bus = await _context.Buses
                    .Include(b => b.Route)
                    .FirstOrDefaultAsync(b => b.Id == busId);

                if (bus == null || bus.RouteId == null) return false;

                var station = await _context.Stations
                    .FirstOrDefaultAsync(s => s.RouteId == bus.RouteId.Value && s.Name == stationName);

                if (station != null)
                {
                    station.Reached = true;
                    _context.Stations.Update(station);
                    var savedChanges = await _context.SaveChangesAsync();
                    return savedChanges > 0;
                }

                // If station is not found, we still return true (assuming successful operation) unless we want to log a warning
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error recording station: {ex.Message}");
                return false;
            }
        }
    }
}