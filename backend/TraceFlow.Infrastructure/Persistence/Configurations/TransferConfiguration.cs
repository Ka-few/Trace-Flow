using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TraceFlow.Domain.Entities;

namespace TraceFlow.Infrastructure.Persistence.Configurations;

public class TransferConfiguration : IEntityTypeConfiguration<Transfer>
{
    public void Configure(EntityTypeBuilder<Transfer> builder)
    {
        builder.HasKey(t => t.Id);

        builder.Property(t => t.Status).HasConversion<string>();
        builder.Property(t => t.QuantityTransferred).HasPrecision(18, 4);

        builder.HasOne(t => t.Batch)
            .WithMany()
            .HasForeignKey(t => t.BatchId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(t => t.FromOrganization)
            .WithMany()
            .HasForeignKey(t => t.FromOrganizationId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(t => t.ToOrganization)
            .WithMany()
            .HasForeignKey(t => t.ToOrganizationId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
