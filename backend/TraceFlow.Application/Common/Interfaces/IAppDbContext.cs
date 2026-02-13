using Microsoft.EntityFrameworkCore;
using TraceFlow.Domain.Entities;

namespace TraceFlow.Application.Common.Interfaces;

public interface IAppDbContext
{
    DbSet<Organization> Organizations { get; }
    DbSet<ProductionSite> ProductionSites { get; }
    DbSet<User> Users { get; }
    DbSet<Batch> Batches { get; }
    DbSet<BatchLineage> BatchLineages { get; }
    DbSet<Transfer> Transfers { get; }
    DbSet<AuditLog> AuditLogs { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
