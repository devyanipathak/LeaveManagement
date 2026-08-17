import React, { Component } from 'react'
import Footer from './Footer'
import apiFetch from '../api'
import Swal from 'sweetalert2'

export class AdminRegister extends Component {
  constructor() {
    super();
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      error: '',
      success: '',
      submitting: false
    }
  }

  handleChange = (field) => (e) => {
    this.setState({ [field]: e.target.value });
  }

  handleReset = () => {
    this.setState({
      firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
      error: '', success: ''
    });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ error: '', success: '' });

    const { firstName, lastName, email, password, confirmPassword } = this.state;

    if (!firstName || !lastName || !email || !password) {
      this.setState({ error: 'Please fill in all required fields.' });

      // Sweet Alert added
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in all required fields.'
      });

      return;
    }

    if (password !== confirmPassword) {
      this.setState({ error: 'Passwords do not match.' });

      // Sweet Alert added
      Swal.fire({
        icon: 'warning',
        title: 'Password Mismatch',
        text: 'Passwords do not match.'
      });

      return;
    }

    this.setState({ submitting: true });

    try {
      await apiFetch('/admin/auth/register', {
        method: 'POST',
        body: JSON.stringify({ firstName, lastName, email, password, confirmPassword })
      });

      this.setState({
        success: 'Registration successful! You can now log in.',
        submitting: false
      });

      // Sweet Alert added
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: 'You can now log in.',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        window.location.href = 'admin-login';
      });

    } catch (err) {
      this.setState({ error: err.message, submitting: false });

      // Sweet Alert added
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err.message
      });
    }
  }

  render() {
    const { firstName, lastName, email, password, confirmPassword, error, success, submitting } = this.state;

    return (
      <>
        <div className="container mt-3">
          <h1 className='alert alert-success'>Admin Register</h1>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={this.handleSubmit}>
            <div className='row'>
              <div className='col'>
                <label htmlFor='firstname' className='form-label'>First Name</label>
                <input type='text' name='firstname' className='form-control' placeholder='Enter Your First Name'
                  value={firstName} onChange={this.handleChange('firstName')} />
              </div>

              <div className='col'>
                <label htmlFor='lastname' className='form-label'>Last Name</label>
                <input type='text' name='lastname' className='form-control' placeholder='Enter Your Last Name'
                  value={lastName} onChange={this.handleChange('lastName')} />
              </div>
            </div>

            <div className='row mt-3'>
              <div className='col'>
                <label htmlFor='password' className='form-label'>Password</label>
                <input type='password' name='password' className='form-control' placeholder='Enter Your Password'
                  value={password} onChange={this.handleChange('password')} />
              </div>

              <div className='col'>
                <label htmlFor='confirmpassword' className='form-label'>Confirm Password</label>
                <input type='password' name='confirmpassword' className='form-control' placeholder='Re-enter Your Password'
                  value={confirmPassword} onChange={this.handleChange('confirmPassword')} />
              </div>
            </div>

            <div className='row mt-3'>
              <div className='col'>
                <label htmlFor='email' className='form-label'>E-Mail</label>
                <input type='email' name='email' className='form-control' placeholder='Enter Your E-Mail'
                  value={email} onChange={this.handleChange('email')} />
              </div>
            </div>

            <div className='row mt-3'>
              <div className='col'>
                <input type='reset' className='btn btn-warning' onClick={this.handleReset} />
                <input type='submit' className='btn btn-success mx-3' value={submitting ? 'Registering...' : 'Register'} disabled={submitting} />
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