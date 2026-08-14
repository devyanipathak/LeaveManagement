namespace LeaveManagement.Server.Models;

public class LeaveRequest
{
    public int LeaveRequestId { get; set; }

    public int UserId { get; set; }

    public int LeaveTypeId { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public int NumberOfDays { get; set; }

    public string Reason { get; set; } = string.Empty;

    public string Status { get; set; } = "Pending";

    public string? ManagerComment { get; set; }

    public int? ApprovedBy { get; set; }

    public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public User? User { get; set; }

    public LeaveType? LeaveType { get; set; }

    public User? Approver { get; set; }
}