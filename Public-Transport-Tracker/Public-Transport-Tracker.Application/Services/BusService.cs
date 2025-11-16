using Microsoft.EntityFrameworkCore;
using Public_Transport_Tracker.Application.Abstraction.Services;
using Public_Transport_Tracker.Domain.Contracts;
using Public_Transport_Tracker.Domain.Entities;
using Public_Transport_Tracker.Persistence.Data;

namespace Public_Transport_Tracker.Application.Services
{
    public class BusService : IBusService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly PublicTransportTrackerContext _context; // Keep for direct EF Core functionality like Include/Tracking

        public BusService(IUnitOfWork unitOfWork, PublicTransportTrackerContext context)
        {
            _unitOfWork = unitOfWork;
            _context = context;
        }

        public async Task<IEnumerable<Bus>> GetAllBusesAsync()
        {
            // Include Route navigation property (Requires DbContext)
            return await _context.Buses
                .Include(b => b.Route)
                .ToListAsync();
        }

        public async Task<Bus?> GetBusByIdAsync(Guid id)
        {
            // Include Route navigation property (Requires DbContext)
            return await _context.Buses
                .Include(b => b.Route)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<Bus> CreateBusAsync(string number, int capacity, string? routeName)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(number))
                {
                    throw new ArgumentException("Bus number cannot be empty.", nameof(number));
                }

                if (capacity <= 0)
                {
                    throw new ArgumentException("Bus capacity must be greater than 0.", nameof(capacity));
                }

                var bus = new Bus
                {
                    Id = Guid.NewGuid(),
                    Number = number.Trim(),
                    Capacity = capacity,
                    Status = "available",
                    CreatedAt = DateTime.UtcNow
                };

                // Optionally link bus to route if routeName is provided
                if (!string.IsNullOrWhiteSpace(routeName))
                {
                    // FIX START: إعادة كتابة الاستعلام لتجنب خطأ الترجمة
                    var routeNameLower = routeName.Trim().ToLower();

                    var matchingRoute = await _context.Routes
                        .FirstOrDefaultAsync(r => r.RouteName.ToLower() == routeNameLower);

                    // FIX END

                    if (matchingRoute != null)
                    {
                        bus.RouteId = matchingRoute.Id;
                    }
                }

                // FIX: Use UnitOfWork for consistency
                await _unitOfWork.Buses.AddAsync(bus);

                // Save changes and verify
                var savedChanges = await _unitOfWork.SaveChangesAsync(); // Use UoW SaveChanges

                if (savedChanges <= 0)
                {
                    throw new InvalidOperationException("Failed to save bus to database. No changes were persisted.");
                }

                // Verify the bus was actually saved by querying the database (and include Route)
                var savedBus = await _context.Buses
                    .Include(b => b.Route)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(b => b.Id == bus.Id);

                if (savedBus == null)
                {
                    throw new InvalidOperationException("Bus was not found in database after save operation.");
                }

                Console.WriteLine($"✅ Bus created successfully: {savedBus.Number} (ID: {savedBus.Id})");
                return savedBus;
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine($"❌ Database error creating bus: {dbEx.Message}");
                if (dbEx.InnerException != null)
                {
                    Console.WriteLine($"   Inner exception: {dbEx.InnerException.Message}");
                }
                throw new InvalidOperationException($"Database error while creating bus: {dbEx.Message}", dbEx);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error creating bus: {ex.Message}");
                Console.WriteLine($"   Stack trace: {ex.StackTrace}");
                throw;
            }
        }

        public async Task<bool> UpdateBusAsync(Guid id, string? number, int? capacity, string? status)
        {
            try
            {
                var bus = await _unitOfWork.Buses.GetByIdAsync(id);
                if (bus == null) return false;

                if (!string.IsNullOrEmpty(number))
                    bus.Number = number;
                if (capacity.HasValue)
                    bus.Capacity = capacity.Value;
                if (!string.IsNullOrEmpty(status))
                    bus.Status = status;

                await _unitOfWork.Buses.UpdateAsync(bus);
                await _unitOfWork.SaveChangesAsync();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> DeleteBusAsync(Guid id)
        {
            try
            {
                var bus = await _unitOfWork.Buses.GetByIdAsync(id);
                if (bus == null) return false;

                await _unitOfWork.Buses.DeleteAsync(bus);
                await _unitOfWork.SaveChangesAsync();

                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}