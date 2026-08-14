using LeaveManagement.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagement.Server.Controllers;

// ==========================================
// Small read-only reference-data endpoints.
// Used to populate dropdowns on the register
// and leave-request forms, and to show the
// upcoming company holidays.
// ==========================================
[ApiController]
[Route("api/lookup")]
public class LookupController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public LookupController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/lookup/roles
    [HttpGet("roles")]
    public async Task<IActionResult> GetRoles()
    {
        var roles = await _context.Roles
            .Select(r => new { r.RoleId, r.RoleName })
            .ToListAsync();

        return Ok(roles);
    }

    // GET: api/lookup/departments
    [HttpGet("departments")]
    public async Task<IActionResult> GetDepartments()
    {
        var departments = await _context.Departments
            .Select(d => new { d.DepartmentId, d.DepartmentName })
            .ToListAsync();

        return Ok(departments);
    }

    // GET: api/lookup/holidays
    [HttpGet("holidays")]
    public async Task<IActionResult> GetHolidays()
    {
        var holidays = await _context.Holidays
            .OrderBy(h => h.HolidayDate)
            .Select(h => new
            {
                h.HolidayId,
                h.HolidayName,
                h.HolidayDate,
                h.Description
            })
            .ToListAsync();

        return Ok(holidays);
    }
}
