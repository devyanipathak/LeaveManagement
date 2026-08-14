using LeaveManagement.Server.Data;
using LeaveManagement.Server.DTOs.Admin;
using LeaveManagement.Server.Models;
using LeaveManagement.Server.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagement.Server.Controllers;

[ApiController]
[Route("api/admin/auth")]
public class AdminAuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly JwtService _jwtService;
    private readonly PasswordHasher<Admin> _passwordHasher;

    public AdminAuthController(
        ApplicationDbContext context,
        JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
        _passwordHasher = new PasswordHasher<Admin>();
    }


    // ==========================================
    // ADMIN REGISTRATION
    // POST: api/admin/auth/register
    // ==========================================

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        AdminRegisterDto dto)
    {
        // 1. Validate passwords
        if (dto.Password != dto.ConfirmPassword)
        {
            return BadRequest(new
            {
                message = "Passwords do not match."
            });
        }

        // 2. Check if email already exists
        var existingAdmin = await _context.Admins
            .FirstOrDefaultAsync(a => a.Email == dto.Email);

        if (existingAdmin != null)
        {
            return BadRequest(new
            {
                message = "An admin with this email already exists."
            });
        }

        // 3. Create Admin object
        var admin = new Admin
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email
        };

        // 4. Hash password
        admin.PasswordHash = _passwordHasher.HashPassword(
            admin,
            dto.Password
        );

        // 5. Save Admin
        _context.Admins.Add(admin);

        await _context.SaveChangesAsync();

        // 6. Return response
        return Ok(new
        {
            message = "Admin registered successfully."
        });
    }


    // ==========================================
    // ADMIN LOGIN
    // POST: api/admin/auth/login
    // ==========================================

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        AdminLoginDto dto)
    {
        // 1. Find admin by email
        var admin = await _context.Admins
            .FirstOrDefaultAsync(a => a.Email == dto.Email);

        // 2. Check if admin exists
        if (admin == null)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        // 3. Verify password
        var passwordResult =
            _passwordHasher.VerifyHashedPassword(
                admin,
                admin.PasswordHash,
                dto.Password
            );

        if (passwordResult == PasswordVerificationResult.Failed)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        // 4. Generate JWT
        var token = _jwtService.GenerateToken(
            admin.AdminId,
            admin.Email,
            "Admin"
        );

        // 5. Return token and admin information
        return Ok(new
        {
            message = "Admin login successful.",
            token = token,
            adminId = admin.AdminId,
            firstName = admin.FirstName,
            lastName = admin.LastName,
            email = admin.Email,
            role = "Admin"
        });
    }
}