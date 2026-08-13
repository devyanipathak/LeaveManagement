using LeaveManagement.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagement.Server.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Role> Roles { get; set; }

    public DbSet<Department> Departments { get; set; }

    public DbSet<User> Users { get; set; }

    public DbSet<LeaveType> LeaveTypes { get; set; }

    public DbSet<LeaveBalance> LeaveBalances { get; set; }

    public DbSet<LeaveRequest> LeaveRequests { get; set; }

    public DbSet<Holiday> Holidays { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Role -> Users
        modelBuilder.Entity<User>()
            .HasOne(u => u.Role)
            .WithMany(r => r.Users)
            .HasForeignKey(u => u.RoleId)
            .OnDelete(DeleteBehavior.Restrict);

        // Department -> Users
        modelBuilder.Entity<User>()
            .HasOne(u => u.Department)
            .WithMany(d => d.Users)
            .HasForeignKey(u => u.DepartmentId)
            .OnDelete(DeleteBehavior.SetNull);

        // Manager -> Employees
        modelBuilder.Entity<User>()
            .HasOne(u => u.Manager)
            .WithMany(u => u.TeamMembers)
            .HasForeignKey(u => u.ManagerId)
            .OnDelete(DeleteBehavior.Restrict);

        // User -> LeaveBalances
        modelBuilder.Entity<LeaveBalance>()
            .HasOne(lb => lb.User)
            .WithMany(u => u.LeaveBalances)
            .HasForeignKey(lb => lb.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // LeaveType -> LeaveBalances
        modelBuilder.Entity<LeaveBalance>()
            .HasOne(lb => lb.LeaveType)
            .WithMany(lt => lt.LeaveBalances)
            .HasForeignKey(lb => lb.LeaveTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        // User -> LeaveRequests
        modelBuilder.Entity<LeaveRequest>()
            .HasOne(lr => lr.User)
            .WithMany(u => u.LeaveRequests)
            .HasForeignKey(lr => lr.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // LeaveType -> LeaveRequests
        modelBuilder.Entity<LeaveRequest>()
            .HasOne(lr => lr.LeaveType)
            .WithMany(lt => lt.LeaveRequests)
            .HasForeignKey(lr => lr.LeaveTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        // LeaveRequest -> Approver
        modelBuilder.Entity<LeaveRequest>()
            .HasOne(lr => lr.Approver)
            .WithMany()
            .HasForeignKey(lr => lr.ApprovedBy)
            .OnDelete(DeleteBehavior.Restrict);

        // Unique Email
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // One leave balance per User + LeaveType + Year
        modelBuilder.Entity<LeaveBalance>()
            .HasIndex(lb => new
            {
                lb.UserId,
                lb.LeaveTypeId,
                lb.Year
            })
            .IsUnique();
    }
}