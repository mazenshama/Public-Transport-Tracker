using Public_Transport_Tracker.Domain.Contracts;
using Public_Transport_Tracker.Persistence.Data;
using Public_Transport_Tracker.Persistence.GenericRepository;

namespace Public_Transport_Tracker.Persistence.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly PublicTransportTrackerContext _context;

        // الحقول الخاصة بالمستودعات
        private IGenericRepository<Domain.Entities.User>? _users;
        private IGenericRepository<Domain.Entities.Bus>? _buses;
        private IGenericRepository<Domain.Entities.Route>? _routes;
        private IGenericRepository<Domain.Entities.Station>? _stations;
        private IGenericRepository<Domain.Entities.Contact>? _contacts;
        private IGenericRepository<Domain.Entities.Driver>? _drivers; // NEW

        public UnitOfWork(PublicTransportTrackerContext context)
        {
            _context = context;
        }

        // NEW: خاصية السائقين
        public IGenericRepository<Domain.Entities.Driver> Drivers
        {
            get
            {
                return _drivers ??= new GenericRepository<Domain.Entities.Driver>(_context);
            }
        }

        public IGenericRepository<Domain.Entities.User> Users
        {
            get
            {
                return _users ??= new GenericRepository<Domain.Entities.User>(_context);
            }
        }

        public IGenericRepository<Domain.Entities.Bus> Buses
        {
            get
            {
                return _buses ??= new GenericRepository<Domain.Entities.Bus>(_context);
            }
        }

        public IGenericRepository<Domain.Entities.Route> Routes
        {
            get
            {
                return _routes ??= new GenericRepository<Domain.Entities.Route>(_context);
            }
        }

        public IGenericRepository<Domain.Entities.Station> Stations
        {
            get
            {
                return _stations ??= new GenericRepository<Domain.Entities.Station>(_context);
            }
        }

        public IGenericRepository<Domain.Entities.Contact> Contacts
        {
            get
            {
                return _contacts ??= new GenericRepository<Domain.Entities.Contact>(_context);
            }
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public int SaveChanges()
        {
            return _context.SaveChanges();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}