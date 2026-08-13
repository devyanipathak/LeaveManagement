namespace LeaveManagement.Server.Models;

public class LeaveBalance
{
    public int LeaveBalanceId { get; set; }

    public int UserId { get; set; }

    public int LeaveTypeId { get; set; }

    public int Year { get; set; }

    public int AllocatedDays { get; set; }

    public int UsedDays { get; set; }

    // Navigation properties
    public User? User { get; set; }

    public LeaveType? LeaveType { get; set; }

    public int RemainingDays => AllocatedDays - UsedDays;
}