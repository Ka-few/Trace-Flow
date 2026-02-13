using TraceFlow.Domain.Common;
using TraceFlow.Domain.Exceptions;

namespace TraceFlow.Domain.Entities;

public class ProductionSite : AuditableEntity
{
    public Guid OrganizationId { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string? LocationText { get; private set; }

    // Navigation
    public Organization Organization { get; private set; } = null!;

    private ProductionSite() { }

    public ProductionSite(Guid organizationId, string name, string? locationText)
    {
        if (organizationId == Guid.Empty) throw new DomainException("Organization ID is required.");
        if (string.IsNullOrWhiteSpace(name)) throw new DomainException("Site name is required.");

        OrganizationId = organizationId;
        Name = name;
        LocationText = locationText;
    }
}
