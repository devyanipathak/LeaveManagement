import React, { Component } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import EmployeeRegister from './components/EmployeeRegister'
import EmployeeLogin from './components/EmployeeLogin'
import EmployeeDashboard from './components/EmployeeDashboard'
import AdminRegister from './components/AdminRegister'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './components/Home'

export class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="employee-register" element={<EmployeeRegister />} />
          <Route path="employee-login" element={<EmployeeLogin />} />
          <Route
            path="employee-dashboard"
            element={
              <ProtectedRoute role="Employee" redirectTo="/employee-login">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="admin-register" element={<AdminRegister />} />
          <Route path="admin-login" element={<AdminLogin />} />
          <Route
            path="admin-dashboard"
            element={
              <ProtectedRoute role="Admin" redirectTo="/admin-login">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    )
  }
}

export default App
