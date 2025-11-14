using Microsoft.EntityFrameworkCore;
using Public_Transport_Tracker.Domain.Entities;

namespace Public_Transport_Tracker.Persistence.Data
{
    public class PublicTransportTrackerContext : DbContext
    {
        public PublicTransportTrackerContext(DbContextOptions<PublicTransportTrackerContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Bus> Buses { get; set; }
        public DbSet<Route> Routes { get; set; }
        public DbSet<Station> Stations { get; set; }
        public DbSet<Contact> Contacts { get; set; }

        // NEW: إضافة DbSet لكيان السائق
        public DbSet<Driver> Drivers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Apply configurations
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(PublicTransportTrackerContext).Assembly);
        }
    }
}