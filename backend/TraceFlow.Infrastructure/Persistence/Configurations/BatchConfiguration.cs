using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TraceFlow.Domain.Entities;

namespace TraceFlow.Infrastructure.Persistence.Configurations;

public class BatchConfiguration : IEntityTypeConfiguration<Batch>
{
    public void Configure(EntityTypeBuilder<Batch> builder)
    {
        builder.HasKey(b => b.Id);

        builder.Property(b => b.Status)
            .HasConversion<string>(); // Store Enum as String for portability

        builder.Property(b => b.Quantity)
            .HasPrecision(18, 4);

        builder.Property(b => b.ProductType)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasOne(b => b.Organization)
            .WithMany()
            .HasForeignKey(b => b.OrganizationId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(b => b.Site)
            .WithMany()
            .HasForeignKey(b => b.SiteId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(b => b.PublicToken).IsUnique();
        builder.HasIndex(b => b.Status);
    }
}
