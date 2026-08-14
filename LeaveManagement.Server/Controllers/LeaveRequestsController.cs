
using LeaveManagement.Server.Data;
using LeaveManagement.Server.Models;
using LeaveManagement.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeaveRequestsController : ControllerBase
    {
        private readonly ILeaveManagementService _leaveManagementService;
        private readonly ApplicationDbContext _context;

        // Dependency injection brings in the service layout seamlessly
        public LeaveRequestsController(
            ILeaveManagementService leaveManagementService,
            ApplicationDbContext context)
        {
            _leaveManagementService = leaveManagementService;
            _context = context;
        }

        /// <summary>
        /// GET: api/LeaveRequests/leave-types
        /// Returns every active leave type, for populating the "apply for
        /// leave" dropdown.
        /// </summary>
        [HttpGet("leave-types")]
        [Authorize]
        public async Task<IActionResult> GetLeaveTypes()
        {
            var leaveTypes = await _context.LeaveTypes
                .Where(lt => lt.IsActive)
                .Select(lt => new
                {
                    lt.LeaveTypeId,
                    lt.Name,
                    lt.Description,
                    lt.AllocatedDays,
                    lt.IsPaid
                })
                .ToListAsync();

            return Ok(leaveTypes);
        }

        /// <summary>
        /// GET: api/LeaveRequests/balances/{userId}
        /// Returns the calling employee's leave balances (allocated, used,
        /// remaining) for the current year, one row per leave type.
        /// </summary>
        [HttpGet("balances/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetLeaveBalances(int userId)
        {
            var currentYear = DateTime.UtcNow.Year;

            var balances = await _context.LeaveBalances
                .Include(b => b.LeaveType)
                .Where(b => b.UserId == userId && b.Year == currentYear)
                .Select(b => new
                {
                    b.LeaveBalanceId,
                    b.LeaveTypeId,
                    LeaveTypeName = b.LeaveType != null ? b.LeaveType.Name : "Unknown",
                    IsPaid = b.LeaveType != null && b.LeaveType.IsPaid,
                    b.Year,
                    b.AllocatedDays,
                    b.UsedDays,
                    b.RemainingDays
                })
                .ToListAsync();

            return Ok(balances);
        }

        /// <summary>
        /// POST: api/LeaveRequests/submit
        /// Submits a brand new employee leave request.
        /// </summary>
        [HttpPost("submit")]
        [Authorize]
        public async Task<IActionResult> SubmitLeaveRequest([FromBody] SubmitLeaveRequestDto dto)
        {
            if (dto == null) return BadRequest("Invalid request payload.");

            var isSubmitted = await _leaveManagementService.SubmitLeaveRequestAsync(
                dto.UserId,
                dto.LeaveTypeId,
                dto.StartDate,
                dto.EndDate,
                dto.Reason
            );

            if (!isSubmitted)
            {
                return BadRequest("Could not submit leave request. Verify your date parameters and ensure your remaining unallocated balance is sufficient.");
            }

            return Ok(new { Message = "Leave request submitted successfully and is pending review." });
        }

        /// <summary>
        /// GET: api/LeaveRequests/history/{userId}
        /// Retrieves the complete historical log of leave requests for a single employee.
        /// </summary>
        [HttpGet("history/{userId}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<object>>> GetEmployeeLeaveHistory(int userId)
        {
            var history = await _leaveManagementService.GetEmployeeLeaveHistoryAsync(userId);

            var result = history.Select(r => new
            {
                r.LeaveRequestId,
                r.LeaveTypeId,
                LeaveTypeName = r.LeaveType != null ? r.LeaveType.Name : "Unknown",
                r.StartDate,
                r.EndDate,
                r.NumberOfDays,
                r.Reason,
                r.Status,
                r.ManagerComment,
                r.AppliedAt,
                r.UpdatedAt
            });

            return Ok(result);
        }

        /// <summary>
        /// GET: api/LeaveRequests/all
        /// Admin-only view of every leave request across every employee,
        /// most recently applied first.
        /// </summary>
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllRequests()
        {
            var requests = await _context.LeaveRequests
                .Include(r => r.User)
                    .ThenInclude(u => u!.Department)
                .Include(r => r.LeaveType)
                .OrderByDescending(r => r.AppliedAt)
                .Select(r => new
                {
                    r.LeaveRequestId,
                    r.UserId,
                    EmployeeName = r.User != null
                        ? r.User.FirstName + " " + r.User.LastName
                        : "Unknown",
                    Department = r.User != null && r.User.Department != null
                        ? r.User.Department.DepartmentName
                        : null,
                    LeaveTypeName = r.LeaveType != null ? r.LeaveType.Name : "Unknown",
                    r.StartDate,
                    r.EndDate,
                    r.NumberOfDays,
                    r.Reason,
                    r.Status,
                    r.ManagerComment,
                    r.AppliedAt
                })
                .ToListAsync();

            return Ok(requests);
        }

        /// <summary>
        /// POST: api/LeaveRequests/process-approval
        /// Allows an admin to approve or reject a pending leave request.
        /// </summary>
        [HttpPost("process-approval")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ProcessLeaveApproval([FromBody] ProcessLeaveApprovalDto dto)
        {
            if (dto == null) return BadRequest("Invalid request payload.");

            // Strict parameter mapping guard to ensure clean status values
            if (!dto.Status.Equals("Approved", StringComparison.OrdinalIgnoreCase) &&
                !dto.Status.Equals("Rejected", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Invalid status property. Allowed values are 'Approved' or 'Rejected'.");
            }

            // NOTE: the reviewer here is an Admin, which lives in a
            // separate table from Users, so we deliberately do not try to
            // stamp an ApprovedBy user id (that column is a foreign key
            // into Users, and an Admin id would not be a valid match).
            var isProcessed = await _leaveManagementService.ProcessLeaveApprovalAsync(
                dto.LeaveRequestId,
                dto.Status,
                dto.ManagerComment
            );

            if (!isProcessed)
            {
                return BadRequest("Failed to process approval. Verify that the request exists and its current status is 'Pending'.");
            }

            return Ok(new { Message = $"Leave request state successfully updated to: {dto.Status}" });
        }
    }

    // --- Structured Data Transfer Objects (DTOs) encapsulated below ---

    public class SubmitLeaveRequestDto
    {
        public int UserId { get; set; }
        public int LeaveTypeId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Reason { get; set; } = string.Empty;
    }

    public class ProcessLeaveApprovalDto
    {
        public int LeaveRequestId { get; set; }
        public string Status { get; set; } = string.Empty; // "Approved" or "Rejected"
        public string ManagerComment { get; set; } = string.Empty;
    }
}
