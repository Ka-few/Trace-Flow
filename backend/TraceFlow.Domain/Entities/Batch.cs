using TraceFlow.Domain.Common;
using TraceFlow.Domain.Enums;
using TraceFlow.Domain.Exceptions;

namespace TraceFlow.Domain.Entities;

public class Batch : AuditableEntity
{
    public Guid OrganizationId { get; private set; }
    public Guid? SiteId { get; private set; }
    public string PublicToken { get; private set; } = string.Empty;
    public string ProductType { get; private set; } = string.Empty;
    public string? StrainOrVariety { get; private set; }
    public decimal Quantity { get; private set; }
    public string UnitOfMeasure { get; private set; } = "KG";
    public BatchStatus Status { get; private set; }
    public DateTime HarvestDate { get; private set; }
    public DateTime? ProcessDate { get; private set; }

    // Navigation
    public Organization Organization { get; private set; } = null!;
    public ProductionSite? Site { get; private set; }
    
    // Lineage
    private readonly List<BatchLineage> _parentLineage = new(); // Batches that formed THIS batch
    private readonly List<BatchLineage> _childLineage = new(); // Batches formed FROM this batch
    
    public IReadOnlyCollection<BatchLineage> Parents => _parentLineage.AsReadOnly();
    public IReadOnlyCollection<BatchLineage> Children => _childLineage.AsReadOnly();

    private Batch() { }

    public Batch(Guid organizationId, string productType, decimal quantity, DateTime harvestDate, Guid? siteId = null)
    {
        if (quantity < 0) throw new DomainException("Quantity cannot be negative.");
        if (string.IsNullOrWhiteSpace(productType)) throw new DomainException("Product type is required.");

        OrganizationId = organizationId;
        ProductType = productType;
        Quantity = quantity;
        HarvestDate = harvestDate;
        SiteId = siteId;
        Status = BatchStatus.Created;
        PublicToken = Guid.NewGuid().ToString("N"); // Simple token generation
    }

    public void UpdateStatus(BatchStatus newStatus)
    {
        if (!IsValidTransition(Status, newStatus))
        {
            throw new DomainException(
                $"Invalid status transition from {Status} to {newStatus}. " +
                $"This transition is not allowed for compliance and traceability requirements.");
        }
        
        Status = newStatus;
        
        // Set process date when batch is processed
        if (newStatus == BatchStatus.Processed && !ProcessDate.HasValue)
        {
            ProcessDate = DateTime.UtcNow;
        }
    }

    private static bool IsValidTransition(BatchStatus currentStatus, BatchStatus newStatus)
    {
        // Define the allowed state transitions - strict forward-moving matrix
        var allowedTransitions = new Dictionary<BatchStatus, HashSet<BatchStatus>>
        {
            [BatchStatus.Created] = new HashSet<BatchStatus> 
            { 
                BatchStatus.ReadyForTransfer,
                BatchStatus.Processing, 
                BatchStatus.Recalled,
                BatchStatus.Closed
            },
            [BatchStatus.ReadyForTransfer] = new HashSet<BatchStatus> 
            { 
                BatchStatus.InTransit,
                BatchStatus.Processing,
                BatchStatus.Recalled,
                BatchStatus.Closed
            },
            [BatchStatus.InTransit] = new HashSet<BatchStatus> 
            { 
                BatchStatus.Received,
                BatchStatus.Recalled
            },
            [BatchStatus.Received] = new HashSet<BatchStatus> 
            { 
                BatchStatus.Processing,
                BatchStatus.ReadyForTransfer,
                BatchStatus.Recalled
            },
            [BatchStatus.Processing] = new HashSet<BatchStatus> 
            { 
                BatchStatus.Processed,
                BatchStatus.Recalled
            },
            [BatchStatus.Processed] = new HashSet<BatchStatus> 
            { 
                BatchStatus.Sold,
                BatchStatus.ReadyForTransfer,
                BatchStatus.Recalled,
                BatchStatus.Closed
            },
            [BatchStatus.Sold] = new HashSet<BatchStatus>
            {
                BatchStatus.Recalled
            },
            [BatchStatus.Recalled] = new HashSet<BatchStatus>
            {
                BatchStatus.Closed
            },
            [BatchStatus.Closed] = new HashSet<BatchStatus>() // Terminal state
        };

        // Allow staying in the same state (idempotent)
        if (currentStatus == newStatus)
            return true;

        return allowedTransitions.TryGetValue(currentStatus, out var validNextStates) 
               && validNextStates.Contains(newStatus);
    }

    public void DecreaseQuantity(decimal amount)
    {
        if (amount <= 0) throw new DomainException("Amount to decrease must be positive.");
        
        if (Quantity < amount)
            throw new DomainException($"Insufficient quantity in batch {Id}. Available: {Quantity}, Requested: {amount}.");
            
        Quantity -= amount;
    }

    public void SetStrainOrVariety(string? strainOrVariety)
    {
        StrainOrVariety = strainOrVariety;
    }

    public void AddChild(Batch childBatch, decimal quantity)
    {
        if (childBatch == null) throw new DomainException("Child batch cannot be null.");
        if (quantity <= 0) throw new DomainException("Quantity allocated must be positive.");
        if (childBatch.Id == this.Id) throw new DomainException("A batch cannot be its own child.");
        
        // Prevent Cycles: Ensure 'this' is not already an ancestor of 'childBatch' 
        // OR more critically, childBatch is not an ancestor of 'this'.
        if (this.IsDescendantOf(childBatch.Id))
        {
            throw new DomainException($"Traceability Violation: Batch {childBatch.Id} is already an ancestor of {this.Id}. Creating this relationship would create a cycle.");
        }

        // Decrease parent quantity (this will throw if insufficient)
        DecreaseQuantity(quantity);

        // Create the lineage record
        var lineage = new BatchLineage(this.Id, childBatch.Id, quantity);
        
        // Add to child collection of the parent (this)
        _childLineage.Add(lineage);

        // Add to parent collection of the child
        childBatch.AddParentLineageInternal(lineage);
    }

    internal void AddParentLineageInternal(BatchLineage lineage)
    {
        if (lineage.ChildBatchId != this.Id)
            throw new DomainException("Lineage record does not belong to this child batch.");
            
        _parentLineage.Add(lineage);
    }

    /// <summary>
    /// Checks if this batch is a descendant of the specified potential ancestor.
    /// Traverses the parent tree to detect if the ancestorId exists.
    /// </summary>
    public bool IsDescendantOf(Guid potentialAncestorId)
    {
        if (this.Id == potentialAncestorId) return true;

        foreach (var parentLink in _parentLineage)
        {
            // We must be careful about recursion if navigation isn't loaded, 
            // but in the domain model we assume the structure is accessible 
            // or the check is performed on loaded entities.
            if (parentLink.ParentBatch != null && parentLink.ParentBatch.IsDescendantOf(potentialAncestorId))
            {
                return true;
            }
        }

        return false;
    }
}
