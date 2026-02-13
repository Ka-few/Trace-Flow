using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TraceFlow.Domain.Entities;

namespace TraceFlow.Infrastructure.Persistence.Configurations;

public class ProductionSiteConfiguration : IEntityTypeConfiguration<ProductionSite>
{
    public void Configure(EntityTypeBuilder<ProductionSite> builder)
    {
        builder.HasKey(s => s.Id);
        builder.Property(s => s.Name).IsRequired();
    }
}

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);
        
        builder.Property(u => u.Email).IsRequired();
        builder.HasIndex(u => u.Email).IsUnique();
        
        builder.Property(u => u.Role).HasConversion<string>();
        
        builder.Property(u => u.IsActive).HasDefaultValue(true);
    }
}
