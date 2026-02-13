namespace TraceFlow.Application.DTOs.Auth;

public record LoginRequest(string Email, string Password);

public record AuthResponse(
    Guid UserId, 
    string FullName, 
    string Email, 
    string Role, 
    string Token,
    Guid OrganizationId
);
