using FluentValidation;
using MediatR;
using TraceFlow.Application.Common.Interfaces;
using TraceFlow.Application.DTOs.Auth;
using TraceFlow.Domain.Exceptions;

namespace TraceFlow.Application.Features.Auth.Commands.Login;

public record LoginCommand(string Email, string Password) : IRequest<AuthResponse>;

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(v => v.Email).NotEmpty().EmailAddress();
        RuleFor(v => v.Password).NotEmpty();
    }
}

public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponse>
{
    private readonly IAppDbContext _context;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IPasswordHasher _passwordHasher;

    public LoginCommandHandler(
        IAppDbContext context, 
        IJwtTokenGenerator jwtTokenGenerator,
        IPasswordHasher passwordHasher)
    {
        _context = context;
        _jwtTokenGenerator = jwtTokenGenerator;
        _passwordHasher = passwordHasher;
    }

    public async Task<AuthResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = _context.Users
            .FirstOrDefault(u => u.Email == request.Email);

        if (user == null)
        {
             throw new DomainException("Invalid credentials."); 
        }

        // Verify password using BCrypt
        if (!_passwordHasher.VerifyPassword(user.PasswordHash, request.Password)) 
        {
            throw new DomainException("Invalid credentials.");
        }

        // 3. Generate Token
        var token = _jwtTokenGenerator.GenerateToken(user);

        // 4. Return Response
        return new AuthResponse(
            user.Id,
            user.FullName,
            user.Email,
            user.Role.ToString(),
            token,
            user.OrganizationId
        );
    }
}
