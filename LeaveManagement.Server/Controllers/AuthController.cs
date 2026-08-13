using LeaveManagement.Server.Data;
using LeaveManagement.Server.DTOs.Auth;
using LeaveManagement.Server.Models;
using LeaveManagement.Server.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagement.Server.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly JwtService _jwtService;
    private readonly PasswordHasher<User> _passwordHasher;

    public AuthController(
        ApplicationDbContext context,
        JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
        _passwordHasher = new PasswordHasher<User>();
    }

    // ==========================================
    // USER REGISTRATION
    // POST: api/auth/register
    // ==========================================

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        RegisterDto dto)
    {
        // 1. Validate passwords
        if (dto.Password != dto.ConfirmPassword)
        {
            return BadRequest(new
            {
                message = "Passwords do not match."
            });
        }

        // 2. Check duplicate email
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (existingUser != null)
        {
            return BadRequest(new
            {
                message = "A user with this email already exists."
            });
        }

        // 3. Check whether Role exists
        var role = await _context.Roles
            .FirstOrDefaultAsync(r => r.RoleId == dto.RoleId);

        if (role == null)
        {
            return BadRequest(new
            {
                message = "Invalid role selected."
            });
        }

        // 4. Check whether Department exists
        var department = await _context.Departments
            .FirstOrDefaultAsync(
                d => d.DepartmentId == dto.DepartmentId
            );

        if (department == null)
        {
            return BadRequest(new
            {
                message = "Invalid department selected."
            });
        }

        // 5. Create User
        var user = new User
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            RoleId = dto.RoleId,
            DepartmentId = dto.DepartmentId,

            // User doesn't select manager.
            ManagerId = null,

            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        // 6. Hash password
        user.PasswordHash = _passwordHasher.HashPassword(
            user,
            dto.Password
        );

        // 7. Save User
        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        // 8. Return response
        return Ok(new
        {
            message = "User registered successfully.",
            userId = user.UserId,
            role = role.RoleName,
            department = department.DepartmentName
        });
    }


    // ==========================================
    // USER LOGIN
    // POST: api/auth/login
    // ==========================================

    [HttpPost("login")]
    public async Task<IActionResult> Login(
    LoginDto dto)
    {
        // 1. Find user by email
        var user = await _context.Users
            .Include(u => u.Role)
            .Include(u => u.Department)
            .FirstOrDefaultAsync(
                u => u.Email == dto.Email
            );

        // 2. Check user exists
        if (user == null)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        // 3. Check whether account is active
        if (!user.IsActive)
        {
            return Unauthorized(new
            {
                message = "Your account is inactive."
            });
        }

        // 4. Verify password
        var passwordResult =
            _passwordHasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                dto.Password
            );

        if (passwordResult == PasswordVerificationResult.Failed)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        // 5. Generate JWT
        var token = _jwtService.GenerateToken(
            user.UserId,
            user.Email,
            user.Role!.RoleName
        );

        // 6. Return login response
        return Ok(new LoginResponseDto
        {
            Token = token,
            UserId = user.UserId,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Role = user.Role.RoleName,
            Department = user.Department?.DepartmentName
        });
    }
}