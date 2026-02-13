using TraceFlow.Domain.Common;
using TraceFlow.Domain.Enums;
using TraceFlow.Domain.Exceptions;

namespace TraceFlow.Domain.Entities;

public class Organization : AuditableEntity
{
    public string Name { get; private set; } = string.Empty;
    public OrganizationType Type { get; private set; }
    public string? Address { get; private set; }
    public string? ContactEmail { get; private set; }

    // Navigation
    private readonly List<User> _users = new();
    public IReadOnlyCollection<User> Users => _users.AsReadOnly();

    private readonly List<ProductionSite> _sites = new();
    public IReadOnlyCollection<ProductionSite> Sites => _sites.AsReadOnly();

    private Organization() { } // EF Core

    public Organization(string name, OrganizationType type, string? address, string? email)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new DomainException("Organization name is required.");
        if (name.Length < 2) throw new DomainException("Organization name must be at least 2 characters.");

        Name = name;
        Type = type;
        Address = address;
        ContactEmail = email;
    }
}
