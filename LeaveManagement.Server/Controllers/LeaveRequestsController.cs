
using LeaveManagement.Server.Models;
using LeaveManagement.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace LeaveManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeaveRequestsController : ControllerBase
    {
        private readonly ILeaveManagementService _leaveManagementService;

        // Dependency injection brings in the service layout seamlessly
        public LeaveRequestsController(ILeaveManagementService leaveManagementService)
        {
            _leaveManagementService = leaveManagementService;
        }

        /// <summary>
        /// POST: api/LeaveRequests/submit
        /// Submits a brand new employee leave request.
        /// </summary>
        [HttpPost("submit")]
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
        public async Task<ActionResult<IEnumerable<LeaveRequest>>> GetEmployeeLeaveHistory(int userId)
        {
            var history = await _leaveManagementService.GetEmployeeLeaveHistoryAsync(userId);
            return Ok(history);
        }

        /// <summary>
        /// POST: api/LeaveRequests/process-approval
        /// Allows an authorized manager or admin to approve or reject a pending leave request.
        /// </summary>
        [HttpPost("process-approval")]
        public async Task<IActionResult> ProcessLeaveApproval([FromBody] ProcessLeaveApprovalDto dto)
        {
            if (dto == null) return BadRequest("Invalid request payload.");

            // Strict parameter mapping guard to ensure clean status values
            if (!dto.Status.Equals("Approved", StringComparison.OrdinalIgnoreCase) &&
                !dto.Status.Equals("Rejected", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Invalid status property. Allowed values are 'Approved' or 'Rejected'.");
            }

            var isProcessed = await _leaveManagementService.ProcessLeaveApprovalAsync(
                dto.LeaveRequestId,
                dto.Status,
                dto.ApprovedByUserId,
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
        public int ApprovedByUserId { get; set; }
        public string ManagerComment { get; set; } = string.Empty;
    }
}
