using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Public_Transport_Tracker.Domain.Contracts;
using Public_Transport_Tracker.Persistence.Data;
using Public_Transport_Tracker.Persistence.UnitOfWork;

namespace Public_Transport_Tracker.Persistence
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<PublicTransportTrackerContext>(options =>
            {
                options.UseSqlServer(
                    configuration.GetConnectionString("DefaultConnection") ?? 
                    "Server=(localdb)\\mssqllocaldb;Database=PublicTransportTrackerDb;Trusted_Connection=True;MultipleActiveResultSets=true",
                    sqlOptions => sqlOptions.EnableRetryOnFailure(
                        maxRetryCount: 3,
                        maxRetryDelay: TimeSpan.FromSeconds(30),
                        errorNumbersToAdd: null)
                );
                // Ensure change tracking is enabled
                options.EnableSensitiveDataLogging(); // Only for development
                options.EnableServiceProviderCaching();
            });

            services.AddScoped<IUnitOfWork, UnitOfWork.UnitOfWork>();

            return services;
        }
    }
}
