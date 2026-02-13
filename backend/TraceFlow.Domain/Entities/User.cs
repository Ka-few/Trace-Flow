using TraceFlow.Domain.Common;
using TraceFlow.Domain.Enums;
using TraceFlow.Domain.Exceptions;

namespace TraceFlow.Domain.Entities;

public class User : AuditableEntity
{
    public Guid OrganizationId { get; private set; }
    public string Email { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public string FullName { get; private set; } = string.Empty;
    public UserRole Role { get; private set; }
    public bool IsActive { get; private set; } = true;

    // Navigation
    public Organization Organization { get; private set; } = null!;

    private User() { }

    public User(Guid organizationId, string email, string passwordHash, string fullName, UserRole role)
    {
        if (organizationId == Guid.Empty) throw new DomainException("Organization ID is required.");
        if (string.IsNullOrWhiteSpace(email)) throw new DomainException("Email is required.");
        if (string.IsNullOrWhiteSpace(passwordHash)) throw new DomainException("Password hash is required.");
        if (string.IsNullOrWhiteSpace(fullName)) throw new DomainException("Full name is required.");

        OrganizationId = organizationId;
        Email = email;
        PasswordHash = passwordHash;
        FullName = fullName;
        Role = role;
    }

    public void Deactivate() => IsActive = false;
    public void Activate() => IsActive = true;
}
