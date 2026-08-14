import React, { Component } from 'react'
import Footer from './Footer'
import apiFetch from '../api'
import { saveSession } from '../auth'

export class EmployeeLogin extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      error: '',
      submitting: false
    }
  }

  handleChange = (field) => (e) => {
    this.setState({ [field]: e.target.value });
  }

  handleReset = () => {
    this.setState({ email: '', password: '', error: '' });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ error: '' });

    const { email, password } = this.state;
    if (!email || !password) {
      this.setState({ error: 'Please enter your username and password.' });
      return;
    }

    this.setState({ submitting: true });

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      saveSession({
        token: data.token,
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        department: data.department
      });

      window.location.href = 'employee-dashboard';
    } catch (err) {
      this.setState({ error: err.message, submitting: false });
    }
  }

  render() {
    const { email, password, error, submitting } = this.state;

    return (
      <>
        <div className='container mt-3' >
          <h1 className='alert alert-success'>Employee Login</h1>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={this.handleSubmit}>
            <div className='row'>
              <div className='col'>
                <label htmlFor='username' className='form-label'>Username (E-Mail)</label>
                <input type='email' name='username' className='form-control' placeholder='Enter Your Username'
                  value={email} onChange={this.handleChange('email')} />
              </div>
            </div>

            <div className='row mt-3'>
              <div className='col'>
                <label htmlFor='password' className='form-label'>Password</label>
                <input type='password' name='password' className='form-control' placeholder='Enter Your Password'
                  value={password} onChange={this.handleChange('password')} />
              </div>
            </div>

            <div className='row mt-3'>
              <div className='col'>
                <input type='reset' className='btn btn-warning' onClick={this.handleReset} />
                <input type='submit' className='btn btn-success mx-3' value={submitting ? 'Logging in...' : 'Login'} disabled={submitting} />
              </div>
            </div>

            <div className='row mt-3'>
              <p>Don't have an account? <a href='employee-register'>Register Now</a></p>
            </div>
          </form>
        </div >

        <Footer/>
      </>
    )
  }
}

export default EmployeeLogin