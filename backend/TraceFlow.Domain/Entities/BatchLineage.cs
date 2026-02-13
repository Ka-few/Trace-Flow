using TraceFlow.Domain.Common;
using TraceFlow.Domain.Exceptions;

namespace TraceFlow.Domain.Entities;

public class BatchLineage : AuditableEntity
{
    public Guid ParentBatchId { get; private set; }
    public Guid ChildBatchId { get; private set; }
    public decimal QuantityAllocated { get; private set; }

    // Navigation
    public Batch ParentBatch { get; private set; } = null!;
    public Batch ChildBatch { get; private set; } = null!;

    private BatchLineage() { }

    public BatchLineage(Guid parentBatchId, Guid childBatchId, decimal quantity)
    {
        if (parentBatchId == Guid.Empty)
            throw new DomainException("Parent batch ID cannot be empty.");

        if (childBatchId == Guid.Empty)
            throw new DomainException("Child batch ID cannot be empty.");

        if (parentBatchId == childBatchId)
            throw new DomainException("A batch cannot be its own parent.");

        if (quantity <= 0)
            throw new DomainException("Allocated quantity must be greater than zero.");

        ParentBatchId = parentBatchId;
        ChildBatchId = childBatchId;
        QuantityAllocated = quantity;
    }
}
