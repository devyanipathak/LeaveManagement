namespace LeaveManagement.Server.Models;

public class Holiday
{
    public int HolidayId { get; set; }

    public string HolidayName { get; set; } = string.Empty;

    public DateTime HolidayDate { get; set; }

    public string? Description { get; set; }
}