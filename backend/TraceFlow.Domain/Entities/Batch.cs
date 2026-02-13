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
        // Add state transition validation logic here if strictness is needed in Domain
        Status = newStatus;
    }

    public void DecreaseQuantity(decimal amount)
    {
        if (amount <= 0) throw new DomainException("Amount to decrease must be positive.");
        if (Quantity - amount < 0) throw new DomainException("Insufficient quantity.");
        Quantity -= amount;
    }
}
