using TraceFlow.Domain.Common;

namespace TraceFlow.Domain.Entities;

public class BatchLineage : BaseEntity
{
    public Guid ParentBatchId { get; private set; }
    public Guid ChildBatchId { get; private set; }
    public decimal QuantityAllocated { get; private set; }
    public DateTime CreatedAt { get; private set; }

    // Navigation
    public Batch ParentBatch { get; private set; } = null!;
    public Batch ChildBatch { get; private set; } = null!;

    private BatchLineage() { }

    public BatchLineage(Guid parentBatchId, Guid childBatchId, decimal quantity)
    {
        ParentBatchId = parentBatchId;
        ChildBatchId = childBatchId;
        QuantityAllocated = quantity;
        CreatedAt = DateTime.UtcNow;
    }
}
