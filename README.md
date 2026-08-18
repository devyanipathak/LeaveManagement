# Leave Management System

A web-based **Leave Management System** designed to simplify and automate the process of applying, managing, and approving employee leave requests. The system provides secure authentication, role-based access, leave validation, and manager–employee mapping.

## 🚀 Features

* **JWT-Based Authentication** → Secure user authentication using JSON Web Tokens.
* **Role-Based Access Control** → Different access and permissions for Admin, Manager, and Employee roles.
* **Leave Application** → Employees can apply for leave through the system.
* **Leave Approval** → Managers can review, approve, or reject leave requests.
* **Leave Date Validation** → Ensures leave applications follow valid dates and weekday rules.
* **Manager–Employee Mapping** → Maps employees to their respective managers for the approval workflow.
* **Employee Management** → Admin can manage employee records.
* **API Integration** → React Frontend → ASP.NET Core Web API → SQL Server Database.
* **CRUD Operations** → Create, read, update, and delete operations for required entities.
* **Secure Backend APIs** → Authorization and validation are handled at the API level.

## 🛠️ Technology Stack

### Frontend

* React.js
* JavaScript / TypeScript
* HTML
* CSS

### Backend

* ASP.NET Core Web API
* C#
* Entity Framework Core
* JWT Authentication
* Role-Based Authorization

### Database

* Microsoft SQL Server

### Tools

* Visual Studio
* Visual Studio Code
* Git & GitHub
* Postman

## 🏗️ System Architecture

```text
┌──────────────────────┐
│    React Frontend    │
│   User Interface     │
└──────────┬───────────┘
           │ HTTP / REST API
           ▼
┌──────────────────────┐
│ ASP.NET Core Web API │
│ Authentication       │
│ Authorization        │
│ Business Logic       │
│ Leave Management     │
└──────────┬───────────┘
           │ Entity Framework Core
           ▼
┌──────────────────────┐
│    SQL Server DB     │
│ Employees            │
│ Managers             │
│ Leave Requests       │
│ User Data            │
└──────────────────────┘
```

## 👥 User Roles

### Admin

* Manage employees
* Manage employee–manager mapping
* View and manage leave-related information
* Perform administrative operations

### Manager

* View assigned employees
* Review leave applications
* Approve or reject leave requests

### Employee

* Login securely
* Apply for leave
* View leave requests and their status

## 🔐 Authentication & Authorization

The application uses **JWT (JSON Web Token) authentication** to secure API endpoints.

```text
User Login
    ↓
Credentials Validation
    ↓
JWT Token Generated
    ↓
Token Sent with API Requests
    ↓
Authentication & Role Validation
    ↓
Authorized API Access
```

Role-based authorization ensures that users can access only the functionality permitted for their assigned role.

## 📋 Leave Management Workflow

```text
Employee
   ↓
Apply for Leave
   ↓
Validate Leave Dates
   ↓
Submit Leave Request
   ↓
Mapped Manager
   ↓
Review Request
   ↓
Approve / Reject
   ↓
Leave Status Updated
```

## 📅 Leave Validation

The backend validates leave requests before they are stored in the database.

Validation includes:

* Valid leave dates
* Weekday validation
* Appropriate date range
* Required fields
* Employee and manager relationship
* Authorization of the requesting user

## 🔗 API Integration

```text
React Frontend
      ↓
HTTP Requests
      ↓
ASP.NET Core Web API
      ↓
Business Logic & Validation
      ↓
Entity Framework Core
      ↓
SQL Server Database
      ↓
Response
      ↓
React Frontend
```

## 📁 Project Structure

```text
LeaveManagementSystem/
│
├── LeaveManagement.Server/
│   ├── Controllers/
│   ├── Data/
│   ├── Models/
│   ├── Services/
│   ├── DTOs/
│   ├── Migrations/
│   ├── Program.cs
│   └── appsettings.json
│
├── LeaveManagement.Client/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
│
└── README.md
```

> Update the folder names above if your actual frontend/backend project names are different.

## ⚙️ Getting Started

### Prerequisites

Make sure the following are installed:

* .NET SDK
* Node.js and npm
* Microsoft SQL Server
* Visual Studio / VS Code
* Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd LeaveManagementSystem
```

### 2. Configure the Database

Update the SQL Server connection string in:

```text
LeaveManagement.Server/appsettings.json
```

Example:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Your SQL Server Connection String"
  }
}
```

### 3. Apply Database Migrations

From the backend project directory:

```bash
dotnet ef database update
```

### 4. Run the Backend

```bash
dotnet run
```

### 5. Install Frontend Dependencies

From the frontend project directory:

```bash
npm install
```

### 6. Run the Frontend

```bash
npm run dev
```

Open the URL displayed by the Vite development server in your browser.

## 🧪 API Testing

The backend REST APIs can be tested using **Postman**.

Main API areas include:

```text
Authentication
     ↓
Employee Management
     ↓
Manager–Employee Mapping
     ↓
Leave Application
     ↓
Leave Approval
```

## 🔒 Security

* JWT-based authentication
* Role-based authorization
* Protected API endpoints
* Server-side validation
* Secure access to employee and leave information

## 🎯 Project Objective

The main objective of the Leave Management System is to provide a **secure, efficient, and centralized platform** for managing employee leaves while reducing manual work and ensuring a structured approval process.

## 👨‍💻 Future Enhancements

* Email notifications for leave status updates
* Leave balance management
* Holiday calendar integration
* Dashboard with leave statistics
* Advanced reporting
* Audit logs
* Automated notifications for managers and employees

## 📄 License

This project is developed for **learning and training purposes**.
