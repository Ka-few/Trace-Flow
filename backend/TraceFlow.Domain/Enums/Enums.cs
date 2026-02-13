namespace TraceFlow.Domain.Enums;

public enum BatchStatus
{
    Created,
    ReadyForTransfer,
    InTransit,
    Received,
    Processed,
    Closed
}

public enum TransferStatus
{
    Pending,
    Completed,
    Cancelled,
    Rejected
}

public enum OrganizationType
{
    Producer,
    Aggregator,
    Exporter
}

public enum UserRole
{
    Admin,
    Producer,
    Aggregator,
    Exporter
}
