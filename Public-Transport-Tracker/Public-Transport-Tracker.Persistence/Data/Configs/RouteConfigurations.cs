using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Public_Transport_Tracker.Domain.Entities;

namespace Public_Transport_Tracker.Persistence.Data.Configs
{
    public class RouteConfigurations : IEntityTypeConfiguration<Route>
    {
        public void Configure(EntityTypeBuilder<Route> builder)
        {
            builder.HasKey(r => r.Id);

            builder.Property(r => r.RouteName)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(r => r.BusNumber)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(r => r.Stops)
                .HasMaxLength(1000);

            builder.Property(r => r.StartTime)
                .HasMaxLength(50);

            builder.Property(r => r.EndTime)
                .HasMaxLength(50);

            builder.Property(r => r.Frequency)
                .HasMaxLength(50);

            // Configure Stations relationship (one-to-many)
            builder.HasMany(r => r.Stations)
                .WithOne(s => s.Route)
                .HasForeignKey(s => s.RouteId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
