using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Public_Transport_Tracker.Domain.Entities;

namespace Public_Transport_Tracker.Persistence.Data.Configs
{
    public class ContactConfigurations : IEntityTypeConfiguration<Contact>
    {
        public void Configure(EntityTypeBuilder<Contact> builder)
        {
            builder.HasKey(c => c.Id);

            builder.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(c => c.Email)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(c => c.Phone)
                .HasMaxLength(50);

            builder.Property(c => c.Subject)
                .HasMaxLength(200);

            builder.Property(c => c.Message)
                .IsRequired()
                .HasMaxLength(2000);

            builder.Property(c => c.SubmittedAt)
                .IsRequired();
        }
    }
}

