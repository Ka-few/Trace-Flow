using System.Reflection;
using Microsoft.EntityFrameworkCore;
using TraceFlow.Application.Common.Interfaces;
using TraceFlow.Domain.Entities;
using TraceFlow.Infrastructure.Persistence.Interceptors;

namespace TraceFlow.Infrastructure.Persistence;

public class AppDbContext : DbContext, IAppDbContext
{
    private readonly AuditableEntityInterceptor _auditableEntityInterceptor;

    public AppDbContext(
        DbContextOptions<AppDbContext> options,
        AuditableEntityInterceptor auditableEntityInterceptor) 
        : base(options)
    {
        _auditableEntityInterceptor = auditableEntityInterceptor;
    }

    public DbSet<Organization> Organizations => Set<Organization>();
    public DbSet<ProductionSite> ProductionSites => Set<ProductionSite>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Batch> Batches => Set<Batch>();
    public DbSet<BatchLineage> BatchLineages => Set<BatchLineage>();
    public DbSet<Transfer> Transfers => Set<Transfer>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(builder);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.AddInterceptors(_auditableEntityInterceptor);
    }
}
