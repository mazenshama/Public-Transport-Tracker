using Microsoft.EntityFrameworkCore;
using Public_Transport_Tracker.Application.Abstraction.Services;
using Public_Transport_Tracker.Domain.Contracts;
using Public_Transport_Tracker.Domain.Entities;
using Public_Transport_Tracker.Persistence.Data;

namespace Public_Transport_Tracker.Application.Services
{
    public class RouteService : IRouteService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly PublicTransportTrackerContext _context;

        public RouteService(IUnitOfWork unitOfWork, PublicTransportTrackerContext context)
        {
            _unitOfWork = unitOfWork;
            _context = context;
        }

        public async Task<IEnumerable<Route>> GetAllRoutesAsync()
        {
            return await _context.Routes
                .Include(r => r.Stations)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<Route?> GetRouteByIdAsync(Guid id)
        {
            return await _context.Routes
                .Include(r => r.Stations)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<Route> CreateRouteAsync(string routeName, string busNumber, string stops, string startTime, string endTime, string frequency)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(routeName))
                {
                    throw new ArgumentException("Route name cannot be empty.", nameof(routeName));
                }

                if (string.IsNullOrWhiteSpace(busNumber))
                {
                    throw new ArgumentException("Bus number cannot be empty.", nameof(busNumber));
                }

                var route = new Route
                {
                    Id = Guid.NewGuid(),
                    RouteName = routeName.Trim(),
                    BusNumber = busNumber.Trim(),
                    Stops = stops?.Trim() ?? string.Empty,
                    StartTime = startTime?.Trim() ?? string.Empty,
                    EndTime = endTime?.Trim() ?? string.Empty,
                    Frequency = frequency?.Trim() ?? string.Empty,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Routes.Add(route);
                var savedChanges = await _context.SaveChangesAsync();

                if (savedChanges <= 0)
                {
                    throw new InvalidOperationException("Failed to save route to database. No changes were persisted.");
                }

                // Reload the route to ensure it's properly saved
                var savedRoute = await _context.Routes
                    .Include(r => r.Stations)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(r => r.Id == route.Id);

                if (savedRoute == null)
                {
                    throw new InvalidOperationException("Route was not found in database after save operation.");
                }

                Console.WriteLine($"✅ Route created successfully: {savedRoute.RouteName} (ID: {savedRoute.Id})");
                return savedRoute;
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine($"❌ Database error creating route: {dbEx.Message}");
                throw new InvalidOperationException($"Database error while creating route: {dbEx.Message}", dbEx);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error creating route: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> UpdateRouteAsync(Guid id, string? routeName, string? busNumber, string? stops, string? startTime, string? endTime, string? frequency)
        {
            try
            {
                var route = await _context.Routes.FirstOrDefaultAsync(r => r.Id == id);
                if (route == null) return false;

                if (!string.IsNullOrWhiteSpace(routeName))
                    route.RouteName = routeName.Trim();
                if (!string.IsNullOrWhiteSpace(busNumber))
                    route.BusNumber = busNumber.Trim();
                if (!string.IsNullOrWhiteSpace(stops))
                    route.Stops = stops.Trim();
                if (!string.IsNullOrWhiteSpace(startTime))
                    route.StartTime = startTime.Trim();
                if (!string.IsNullOrWhiteSpace(endTime))
                    route.EndTime = endTime.Trim();
                if (!string.IsNullOrWhiteSpace(frequency))
                    route.Frequency = frequency.Trim();

                _context.Routes.Update(route);
                var savedChanges = await _context.SaveChangesAsync();

                return savedChanges > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error updating route: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteRouteAsync(Guid id)
        {
            try
            {
                var route = await _context.Routes.FirstOrDefaultAsync(r => r.Id == id);
                if (route == null) return false;

                _context.Routes.Remove(route);
                var savedChanges = await _context.SaveChangesAsync();

                return savedChanges > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error deleting route: {ex.Message}");
                return false;
            }
        }
    }
}
