using System.Linq.Expressions; // تأكد من وجود هذا الـ using

namespace Public_Transport_Tracker.Domain.Contracts
{
    public interface IUnitOfWork : IDisposable
    {
        // الخصائص القديمة
        IGenericRepository<Domain.Entities.User> Users { get; }
        IGenericRepository<Domain.Entities.Bus> Buses { get; }
        IGenericRepository<Domain.Entities.Route> Routes { get; }
        IGenericRepository<Domain.Entities.Station> Stations { get; }

        // NEW: خاصية السائقين الجديدة المطلوبة من قبل AuthService
        IGenericRepository<Domain.Entities.Driver> Drivers { get; }

        Task<int> SaveChangesAsync();
        int SaveChanges();
    }
}