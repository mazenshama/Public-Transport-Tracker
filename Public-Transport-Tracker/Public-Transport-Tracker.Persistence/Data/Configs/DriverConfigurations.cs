using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Public_Transport_Tracker.Domain.Entities;

namespace Public_Transport_Tracker.Persistence.Data.Configs
{
    public class DriverConfigurations : IEntityTypeConfiguration<Driver>
    {
        public void Configure(EntityTypeBuilder<Driver> builder)
        {
            builder.HasKey(d => d.Id);

            builder.Property(d => d.Name)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(d => d.Email)
                .IsRequired()
                .HasMaxLength(200);

            builder.HasIndex(d => d.Email)
                .IsUnique();

            builder.Property(d => d.PasswordHash)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(d => d.PasswordSalt)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(d => d.Phone)
                .HasMaxLength(50);

            builder.Property(d => d.Role)
                .IsRequired()
                .HasMaxLength(50)
                .HasDefaultValue("Driver");

            // العلاقة Bus-Driver يتم تعريفها في BusConfigurations.cs
        }
    }
}