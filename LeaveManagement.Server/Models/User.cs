namespace LeaveManagement.Server.Models;

public class User
{
    public int UserId { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public int RoleId { get; set; }

    public int? DepartmentId { get; set; }

    public int? ManagerId { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public Role? Role { get; set; }

    public Department? Department { get; set; }

    public User? Manager { get; set; }

    public ICollection<User> TeamMembers { get; set; } = new List<User>();

    public ICollection<LeaveRequest> LeaveRequests { get; set; } = new List<LeaveRequest>();

    public ICollection<LeaveBalance> LeaveBalances { get; set; } = new List<LeaveBalance>();
}