using TraceFlow.Domain.Common;
using TraceFlow.Domain.Enums;
using TraceFlow.Domain.Exceptions;

namespace TraceFlow.Domain.Entities;

public class Transfer : AuditableEntity
{
    public Guid BatchId { get; private set; }
    public Guid FromOrganizationId { get; private set; }
    public Guid ToOrganizationId { get; private set; }
    public decimal QuantityTransferred { get; private set; }
    public TransferStatus Status { get; private set; }
    
    public Guid? InitiatedByUserId { get; private set; }
    public Guid? AcceptedByUserId { get; private set; }
    public DateTime InitiatedAt { get; private set; }
    public DateTime? CompletedAt { get; private set; }

    // Navigation
    public Batch Batch { get; private set; } = null!;
    public Organization FromOrganization { get; private set; } = null!;
    public Organization ToOrganization { get; private set; } = null!;

    private Transfer() { }

    public Transfer(Guid batchId, Guid fromOrgId, Guid toOrgId, decimal quantity, Guid initiatorId)
    {
        if (fromOrgId == toOrgId) throw new DomainException("Cannot transfer to the same organization.");
        if (quantity <= 0) throw new DomainException("Transfer quantity must be positive.");

        BatchId = batchId;
        FromOrganizationId = fromOrgId;
        ToOrganizationId = toOrgId;
        QuantityTransferred = quantity;
        InitiatedByUserId = initiatorId;
        Status = TransferStatus.Pending;
        InitiatedAt = DateTime.UtcNow;
    }

    public void Complete(Guid accepterId)
    {
        if (Status != TransferStatus.Pending) throw new DomainException("Transfer is not pending.");
        Status = TransferStatus.Completed;
        AcceptedByUserId = accepterId;
        CompletedAt = DateTime.UtcNow;
    }
    
    public void Cancel()
    {
        if (Status != TransferStatus.Pending) throw new DomainException("Transfer is not pending.");
        Status = TransferStatus.Cancelled;
        CompletedAt = DateTime.UtcNow;
    }
}
