using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TraceFlow.Application.Common.Interfaces;
using TraceFlow.Infrastructure.Persistence;
using TraceFlow.Infrastructure.Persistence.Interceptors;

namespace TraceFlow.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<AuditableEntityInterceptor>();

        services.AddDbContext<AppDbContext>((sp, options) =>
        {
            options.AddInterceptors(sp.GetRequiredService<AuditableEntityInterceptor>());
            
            // Use SQLite for development as requested
            options.UseSqlite(configuration.GetConnectionString("DefaultConnection"));
        });

        services.AddScoped<IAppDbContext>(provider => provider.GetRequiredService<AppDbContext>());
        services.AddSingleton(TimeProvider.System);

        services.Configure<Identity.JwtSettings>(configuration.GetSection(Identity.JwtSettings.SectionName));
        services.AddSingleton<IJwtTokenGenerator, Identity.JwtTokenGenerator>();
        services.AddSingleton<IPasswordHasher, Identity.BCryptPasswordHasher>();

        return services;
    }
}
