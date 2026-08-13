import React, { Component } from 'react'

export class EmployeeRegister extends Component {
  render() {
    return (
      <>
        <div className="container mt-3">
          <h1 className='alert alert-success'>Employee Register</h1>
          <form>
            <div className='row'>
              <div className='col'>
                <label htmlFor='firstname' className='form-label'>First Name</label>
                <input type='text' name='firstname' className='form-control' placeholder='Enter Your First Name' />
              </div>
            </div>

            <div className='row mt-3'>
              <div className='col'>
                <label htmlFor='lastname' className='form-label'>Last Name</label>
                <input type='text' name='lastname' className='form-control' placeholder='Enter Your Last Name' />
              </div>
            </div>

            <div className='row mt-3'>
              <div className='col'>
                <label htmlFor='email' className='form-label'>E-Mail</label>
                <input type='text' name='email' className='form-control' placeholder='Enter Your E-Mail' />
              </div>
            </div>

            <div className='row mt-3'>
              <div className='col'>
                <label htmlFor='password' className='form-label'>Password</label>
                <input type='text' name='password' className='form-control' placeholder='Enter Your Password' />
              </div>
            </div>

            <div className='row mt-3'>
              <div className='col'>
                <label htmlFor='role' className='form-label'>Role</label>
                <select class="form-select">
                  <option selected>Select Your Role</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Application Developer">Application Developer</option>
                  <option value="Software Engineer">Software Engineer</option>
                </select>
              </div>
            </div>

            <div className='row mt-3'>
              <div className='col'>
                <label htmlFor='department' className='form-label'>Department</label>
                <select class="form-select">
                  <option selected>Select Your Department</option>
                  <option value="Development">Development</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">HR</option>
                </select>
              </div>
            </div>


            <div className='row mt-3'>
              <div className='col'>
                <input type='reset' className='btn btn-warning' />
                <input type='submit' className='btn btn-success mx-3' value='Login' />
              </div>
            </div>

            <div className='row mt-3'>
              <p>Don't have an account? <a href='employee-register'>Register Now</a></p>
            </div>
          </form>
        </div>
      </>
    )
  }
}

export default EmployeeRegister