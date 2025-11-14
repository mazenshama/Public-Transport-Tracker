using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Public_Transport_Tracker.Domain.Entities;

namespace Public_Transport_Tracker.Persistence.Data.Configs
{
    public class BusConfigurations : IEntityTypeConfiguration<Bus>
    {
        public void Configure(EntityTypeBuilder<Bus> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.Number)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(b => b.Capacity)
                .IsRequired();

            builder.Property(b => b.Status)
                .IsRequired()
                .HasMaxLength(50)
                .HasDefaultValue("available");

            // Configure Route relationship (many-to-one)
            builder.HasOne(b => b.Route)
                .WithMany(r => r.Buses)
                .HasForeignKey(b => b.RouteId)
                .OnDelete(DeleteBehavior.SetNull);

            // NEW: Configure Driver relationship (many-to-one)
            builder.HasOne(b => b.CurrentDriver)
                .WithMany(d => d.AssignedBuses)
                .HasForeignKey(b => b.CurrentDriverId)
                .IsRequired(false) // CurrentDriverId هو Guid?
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}