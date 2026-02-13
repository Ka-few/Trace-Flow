using System.Security.Claims;
using TraceFlow.Application.Common.Interfaces;

namespace TraceFlow.API.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid? UserId
    {
        get
        {
            var id = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            return id == null ? null : Guid.Parse(id);
        }
    }

    public string? UserEmail => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Email);

    public string? Role => _httpContextAccessor.HttpContext?.User?.FindFirstValue("role");

    public Guid? OrganizationId
    {
        get
        {
            var orgId = _httpContextAccessor.HttpContext?.User?.FindFirstValue("orgId");
            return orgId == null ? null : Guid.Parse(orgId);
        }
    }
}
