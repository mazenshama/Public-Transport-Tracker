using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Public_Transport_Tracker.Domain.Entities;

namespace Public_Transport_Tracker.Persistence.Data.Configs
{
    public class StationConfigurations : IEntityTypeConfiguration<Station>
    {
        public void Configure(EntityTypeBuilder<Station> builder)
        {
            builder.HasKey(s => s.Id);

            builder.Property(s => s.Name)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(s => s.Latitude)
                .IsRequired();

            builder.Property(s => s.Longitude)
                .IsRequired();

            builder.Property(s => s.Reached)
                .HasDefaultValue(false);
        }
    }
}
