import React, { Component } from 'react'
import Footer from './Footer'

export class ManagerLogin extends Component {
  render() {
    return (
      <>
        <div className='container mt-3' >
          <h1 className='alert alert-success'>Manager Login</h1>
          <form>
            <div className='row'>
              <div className='col'>
                <label htmlFor='username' className='form-label'>Username</label>
                <input type='text' name='username' className='form-control' placeholder='Enter Your Username' />
              </div>
            </div>

            <div className='row mt-3'>
              <div className='col'>
                <label htmlFor='apssword' className='form-label'>Password</label>
                <input type='text' name='password' className='form-control' placeholder='Enter Your Password' />
              </div>
            </div>

            <div className='row mt-3'>
              <div className='col'>
                <input type='reset' className='btn btn-warning' />
                <input type='submit' className='btn btn-success mx-3' value='Login' />
              </div>
            </div>

            <div className='row mt-3'>
              <p>Don't have an account? <a href='manager-register'>Register Now</a></p>
            </div>
          </form>
        </div >

        <Footer/>
      </>

    )
  }
}

export default ManagerLogin