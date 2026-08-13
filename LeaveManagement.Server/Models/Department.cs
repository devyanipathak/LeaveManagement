namespace LeaveManagement.Server.Models;

public class Department
{
    public int DepartmentId { get; set; }

    public string DepartmentName { get; set; } = string.Empty;

    public ICollection<User> Users { get; set; } = new List<User>();
}