using Microsoft.Extensions.DependencyInjection;
using Public_Transport_Tracker.Application.Abstraction.Services;
using Public_Transport_Tracker.Application.Services;

namespace Public_Transport_Tracker.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IDriverService, DriverService>();
            services.AddScoped<IBusService, BusService>();
            services.AddScoped<IRouteService, RouteService>();
            services.AddScoped<IContactService, ContactService>();

            return services;
        }
    }
}
