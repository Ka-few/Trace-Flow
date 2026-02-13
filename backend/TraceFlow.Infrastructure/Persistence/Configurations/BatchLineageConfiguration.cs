using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TraceFlow.Domain.Entities;

namespace TraceFlow.Infrastructure.Persistence.Configurations;

public class BatchLineageConfiguration : IEntityTypeConfiguration<BatchLineage>
{
    public void Configure(EntityTypeBuilder<BatchLineage> builder)
    {
        // Composite Primary Key (Optional, but often cleaner in Join Tables. 
        // Here we have a dedicated Id as well from BaseEntity, but business key is Parent+Child)
        // Since we inherit BaseEntity, we have an ID. We should enforce uniqueness on pair.
        
        builder.HasOne(x => x.ParentBatch)
            .WithMany(b => b.Children) // Batch.Children
            .HasForeignKey(x => x.ParentBatchId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.ChildBatch)
            .WithMany(b => b.Parents) // Batch.Parents
            .HasForeignKey(x => x.ChildBatchId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.Property(x => x.QuantityAllocated).HasPrecision(18, 4);

        // Ensure unique relationship
        builder.HasIndex(x => new { x.ParentBatchId, x.ChildBatchId }).IsUnique();
    }
}
