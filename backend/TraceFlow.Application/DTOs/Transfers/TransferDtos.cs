namespace TraceFlow.Application.DTOs.Transfers;

public record TransferDto(
    Guid Id,
    Guid BatchId,
    string BatchProductType,
    Guid FromOrganizationId,
    string FromOrganizationName,
    Guid ToOrganizationId,
    string ToOrganizationName,
    decimal QuantityTransferred,
    string Status,
    DateTime InitiatedAt,
    DateTime? CompletedAt,
    string? InitiatedByUserName
);

public record TransferListDto(
    Guid Id,
    string BatchProductType,
    string FromOrganization,
    string ToOrganization,
    decimal Quantity,
    string Status,
    DateTime InitiatedAt
);
