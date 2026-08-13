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

        // ==========================================
        // RELATIONSHIPS
        // ==========================================

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


        // ==========================================
        // INDEXES
        // ==========================================

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


        // ==========================================
        // SEED ROLES
        // ==========================================

        modelBuilder.Entity<Role>().HasData(
            new Role
            {
                RoleId = 1,
                RoleName = "Project Manager"
            },
            new Role
            {
                RoleId = 2,
                RoleName = "Application Developer"
            },
            new Role
            {
                RoleId = 3,
                RoleName = "Software Engineer"
            }
        );


        // ==========================================
        // SEED DEPARTMENTS
        // ==========================================

        modelBuilder.Entity<Department>().HasData(
            new Department
            {
                DepartmentId = 1,
                DepartmentName = "Development"
            },
            new Department
            {
                DepartmentId = 2,
                DepartmentName = "Finance"
            },
            new Department
            {
                DepartmentId = 3,
                DepartmentName = "HR"
            }
        );


        // ==========================================
        // SEED LEAVE TYPES
        // ==========================================

        modelBuilder.Entity<LeaveType>().HasData(
            new LeaveType
            {
                LeaveTypeId = 1,
                Name = "Casual Leave",
                Description = "Leave for personal purposes",
                AllocatedDays = 12,
                IsPaid = true,
                IsActive = true
            },
            new LeaveType
            {
                LeaveTypeId = 2,
                Name = "Sick Leave",
                Description = "Leave due to illness",
                AllocatedDays = 8,
                IsPaid = true,
                IsActive = true
            },
            new LeaveType
            {
                LeaveTypeId = 3,
                Name = "Earned Leave",
                Description = "Earned annual leave",
                AllocatedDays = 15,
                IsPaid = true,
                IsActive = true
            },
            new LeaveType
            {
                LeaveTypeId = 4,
                Name = "Unpaid Leave",
                Description = "Leave without pay",
                AllocatedDays = 0,
                IsPaid = false,
                IsActive = true
            }
        );
    }
}