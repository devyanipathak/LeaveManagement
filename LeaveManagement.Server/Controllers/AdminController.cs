using LeaveManagement.Server.Data;
using LeaveManagement.Server.DTOs.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagement.Server.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ==========================================
    // GET ALL USERS
    // GET: api/admin/users
    // ==========================================

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users
            .Include(u => u.Role)
            .Include(u => u.Department)
            .Include(u => u.Manager)
            .Select(u => new
            {
                u.UserId,
                u.FirstName,
                u.LastName,
                u.Email,

                Role = u.Role!.RoleName,

                Department = u.Department != null
                    ? u.Department.DepartmentName
                    : null,

                ManagerId = u.ManagerId,

                ManagerName = u.Manager != null
                    ? u.Manager.FirstName + " " +
                      u.Manager.LastName
                    : null,

                u.IsActive
            })
            .ToListAsync();

        return Ok(users);
    }


    // ==========================================
    // GET ALL MANAGERS
    // GET: api/admin/managers
    // ==========================================

    [HttpGet("managers")]
    public async Task<IActionResult> GetManagers()
    {
        var managers = await _context.Users
            .Include(u => u.Role)
            .Where(u =>
                u.Role != null &&
                u.Role.RoleName == "Project Manager" &&
                u.IsActive)
            .Select(u => new
            {
                u.UserId,
                u.FirstName,
                u.LastName,
                u.Email,

                Role = u.Role!.RoleName,

                Department = u.Department != null
                    ? u.Department.DepartmentName
                    : null
            })
            .ToListAsync();

        return Ok(managers);
    }


    // ==========================================
    // ASSIGN MANAGER
    // PUT: api/admin/users/{employeeId}/manager
    // ==========================================

    [HttpPut("users/{employeeId}/manager")]
    public async Task<IActionResult> AssignManager(
        int employeeId,
        AssignManagerDto dto)
    {
        // Find employee
        var employee = await _context.Users
            .FirstOrDefaultAsync(u => u.UserId == employeeId);

        if (employee == null)
        {
            return NotFound(new
            {
                message = "Employee not found."
            });
        }

        // Find manager
        var manager = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(
                u => u.UserId == dto.ManagerId
            );

        if (manager == null)
        {
            return NotFound(new
            {
                message = "Manager not found."
            });
        }

        // Make sure selected user is actually a Project Manager
        if (manager.Role == null ||
            manager.Role.RoleName != "Project Manager")
        {
            return BadRequest(new
            {
                message =
                    "Selected user is not a Project Manager."
            });
        }

        // Make sure employee is not assigning themselves
        if (employee.UserId == manager.UserId)
        {
            return BadRequest(new
            {
                message =
                    "A user cannot be their own manager."
            });
        }

        // Assign manager
        employee.ManagerId = manager.UserId;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Manager assigned successfully.",
            employeeId = employee.UserId,
            employeeName =
                employee.FirstName + " " + employee.LastName,
            managerId = manager.UserId,
            managerName =
                manager.FirstName + " " + manager.LastName
        });
    }
}