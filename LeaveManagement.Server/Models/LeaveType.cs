namespace LeaveManagement.Server.Models;

public class LeaveType
{
    public int LeaveTypeId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int AllocatedDays { get; set; }

    public bool IsPaid { get; set; }

    public bool IsActive { get; set; } = true;

    public ICollection<LeaveBalance> LeaveBalances { get; set; } = new List<LeaveBalance>();

    public ICollection<LeaveRequest> LeaveRequests { get; set; } = new List<LeaveRequest>();
}