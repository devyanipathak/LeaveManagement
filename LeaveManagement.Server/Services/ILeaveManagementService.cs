
using LeaveManagement.Server.Models;

namespace LeaveManagement.Server.Services
{
    public interface ILeaveManagementService
    {
        Task<bool> SubmitLeaveRequestAsync(int userId, int leaveTypeId, DateTime startDate, DateTime endDate, string reason);
        Task<IEnumerable<LeaveRequest>> GetEmployeeLeaveHistoryAsync(int userId);
        Task<bool> ProcessLeaveApprovalAsync(int leaveRequestId, string status, string managerComment);
    }
}
