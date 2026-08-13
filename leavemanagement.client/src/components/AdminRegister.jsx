import React, { Component } from 'react'
import Footer from './Footer'

export class AdminRegister extends Component {
  render() {
    return (
      <>
        <div className="container mt-3">
          <h1 className='alert alert-success'>Admin Register</h1>
          <form>
            <div className='row'>
              <div className='col'>
                <label htmlFor='firstname' className='form-label'>First Name</label>
                <input type='text' name='firstname' className='form-control' placeholder='Enter Your First Name' />
              </div>

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

              <div className='col'>
                <label htmlFor='password' className='form-label'>Password</label>
                <input type='text' name='password' className='form-control' placeholder='Enter Your Password' />
              </div>
            </div>

            <div className='row mt-3'>
              <div className='col'>
                <input type='reset' className='btn btn-warning' />
                <input type='submit' className='btn btn-success mx-3' value='Register' />
              </div>
            </div>

            <div className='row mt-3'>
              <p>Already registered? <a href='admin-login'>Login Now</a></p>
            </div>
          </form>
        </div>

        <Footer/>
      </>
    )
  }
}

export default AdminRegister