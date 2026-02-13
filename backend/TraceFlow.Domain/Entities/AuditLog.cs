using TraceFlow.Domain.Common;

namespace TraceFlow.Domain.Entities;

public class AuditLog
{
    public Guid Id { get; private set; }
    public string EntityName { get; private set; } = string.Empty;
    public string EntityId { get; private set; } = string.Empty;
    public string ActionType { get; private set; } = string.Empty; // Created, Modified, Deleted
    public Guid? UserId { get; private set; }
    public string? BeforeData { get; private set; } // JSON
    public string? AfterData { get; private set; } // JSON
    public DateTime Timestamp { get; private set; }

    private AuditLog() { }

    public AuditLog(string entityName, string entityId, string actionType, Guid? userId, string? before, string? after)
    {
        Id = Guid.NewGuid();
        EntityName = entityName;
        EntityId = entityId;
        ActionType = actionType;
        UserId = userId;
        BeforeData = before;
        AfterData = after;
        Timestamp = DateTime.UtcNow;
    }
}
