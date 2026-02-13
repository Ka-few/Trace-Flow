namespace TraceFlow.Application.DTOs.Batches;

public record BatchDto(
    Guid Id,
    Guid OrganizationId,
    string OrganizationName,
    string ProductType,
    decimal Quantity,
    string Status,
    Guid? SiteId,
    DateTime CreatedAt,
    string CreatedBy
);

public record BatchListDto(
    Guid Id,
    string ProductType,
    decimal Quantity,
    string Status,
    string OrganizationName,
    DateTime CreatedAt
);
