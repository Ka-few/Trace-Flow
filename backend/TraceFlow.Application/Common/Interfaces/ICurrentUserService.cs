namespace TraceFlow.Application.Common.Interfaces;

public interface ICurrentUserService
{
    Guid? UserId { get; }
    string? UserEmail { get; }
    string? Role { get; }
    Guid? OrganizationId { get; }
}
