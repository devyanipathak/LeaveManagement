import React, { Component } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import EmployeeRegister from './components/EmployeeRegister'
import EmployeeLogin from './components/EmployeeLogin'
import ManagerRegister from './components/ManagerRegister'
import ManagerLogin from './components/ManagerLogin'
import Home from './components/Home'

export class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="employee-register" element={<EmployeeRegister />} />
          <Route path="employee-login" element={<EmployeeLogin />} />
          <Route path="manager-register" element={<ManagerRegister />} />
          <Route path="manager-login" element={<ManagerLogin />} />
        </Routes>
      </BrowserRouter>
    )
  }
}

export default App