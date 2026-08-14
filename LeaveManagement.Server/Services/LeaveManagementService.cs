using LeaveManagement.Server.Data;
using LeaveManagement.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagement.Server.Services
{
    public class LeaveManagementService : ILeaveManagementService
    {
        private readonly ApplicationDbContext _context;

        public LeaveManagementService(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Submit a brand new leave request
        public async Task<bool> SubmitLeaveRequestAsync(int userId, int leaveTypeId, DateTime startDate, DateTime endDate, string reason)
        {
            // Calculate total requested days inclusive of start and end parameters
            int requestedDays = (endDate.Date - startDate.Date).Days + 1;
            if (requestedDays <= 0) return false;

            // Fetch the user's profile balance matching this specific leave type rule
            var balance = await _context.LeaveBalances
                .FirstOrDefaultAsync(b => b.UserId == userId && b.LeaveTypeId == leaveTypeId);

            // Business Rule: Ensure balance profile exists and has enough RemainingDays left
            if (balance == null || balance.RemainingDays < requestedDays)
            {
                return false;
            }

            // Map database parameters to match your model layout properties precisely
            var leaveRequest = new LeaveRequest
            {
                UserId = userId,
                LeaveTypeId = leaveTypeId,
                StartDate = startDate,
                EndDate = endDate,
                NumberOfDays = requestedDays,
                Reason = reason,
                Status = "Pending",
                AppliedAt = DateTime.UtcNow
            };

            _context.LeaveRequests.Add(leaveRequest);
            await _context.SaveChangesAsync();
            return true;
        }

        // 2. Query historical logs for a given user account
        public async Task<IEnumerable<LeaveRequest>> GetEmployeeLeaveHistoryAsync(int userId)
        {
            return await _context.LeaveRequests
                .Where(r => r.UserId == userId)
                .Include(r => r.LeaveType)
                .OrderByDescending(r => r.AppliedAt)
                .ToListAsync();
        }

        // 3. Process the validation and adjust UsedDays tracking upon approval
        public async Task<bool> ProcessLeaveApprovalAsync(int leaveRequestId, string status, string managerComment)
        {
            // Target the model's exact primary key name: LeaveRequestId
            var request = await _context.LeaveRequests
                .FirstOrDefaultAsync(r => r.LeaveRequestId == leaveRequestId);

            if (request == null || request.Status != "Pending") return false;

            // Apply decision states and update reviewer profiles.
            // ApprovedBy is intentionally left untouched: reviews are
            // performed by an Admin, which is a separate table from
            // Users, so there is no valid Users.UserId to stamp here.
            request.Status = status; // Expected inputs: "Approved" or "Rejected"
            request.ManagerComment = managerComment;
            request.UpdatedAt = DateTime.UtcNow;

            // If Approved, update the UsedDays field to naturally adjust RemainingDays
            if (status.Equals("Approved", StringComparison.OrdinalIgnoreCase))
            {
                var balance = await _context.LeaveBalances
                    .FirstOrDefaultAsync(b => b.UserId == request.UserId && b.LeaveTypeId == request.LeaveTypeId);

                if (balance != null)
                {
                    // Incrementing UsedDays automatically drops the RemainingDays balance count
                    balance.UsedDays += request.NumberOfDays;
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
