import React, { Component } from 'react'
import Footer from './Footer'
import apiFetch from '../api'

export class EmployeeRegister extends Component {
  constructor() {
    super();

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      roleId: '',
      departmentId: '',
      roles: [],
      departments: [],
      error: '',
      success: '',
      submitting: false
    }
  }

  componentDidMount() {
    this.loadLookups();
  }

  loadLookups = async () => {
    try {
      const [roles, departments] = await Promise.all([
        apiFetch('/lookup/roles'),
        apiFetch('/lookup/departments')
      ]);
      this.setState({ roles, departments });
    } catch (err) {
      this.setState({ error: 'Could not load roles/departments. Is the server running?' });
    }
  }

  handleChange = (field) => (e) => {
    this.setState({ [field]: e.target.value });
  }

  handleReset = () => {
    this.setState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      roleId: '',
      departmentId: '',
      error: '',
      success: ''
    });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ error: '', success: '' });

    const { firstName, lastName, email, password, confirmPassword, roleId, departmentId } = this.state;

    if (!firstName || !lastName || !email || !password) {
      this.setState({ error: 'Please fill in all required fields.' });
      return;
    }

    if (!roleId || !departmentId) {
      this.setState({ error: 'Please select your role and department.' });
      return;
    }

    if (password !== confirmPassword) {
      this.setState({ error: 'Passwords do not match.' });
      return;
    }

    this.setState({ submitting: true });

    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          roleId: parseInt(roleId, 10),
          departmentId: parseInt(departmentId, 10)
        })
      });

      this.setState({
        success: 'Registration successful! You can now log in.',
        submitting: false
      });

      setTimeout(() => {
        window.location.href = 'employee-login';
      }, 1200);
    } catch (err) {
      this.setState({ error: err.message, submitting: false });
    }
  }

  render() {
    const {
      firstName, lastName, email, password, confirmPassword,
      roleId, departmentId, roles, departments, error, success, submitting
    } = this.state;

    return (
      <>
        <div className="container mt-3">
          <h1 className='alert alert-success'>Employee Register</h1>

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
                <label htmlFor='email' className='form-label'>E-Mail</label>
                <input type='email' name='email' className='form-control' placeholder='Enter Your E-Mail'
                  value={email} onChange={this.handleChange('email')} />
              </div>

              <div className='col'>
                <label htmlFor='password' className='form-label'>Password</label>
                <input type='password' name='password' className='form-control' placeholder='Enter Your Password'
                  value={password} onChange={this.handleChange('password')} />
              </div>
            </div>

            <div className='row mt-3'>
              <div className='col'>
                <label htmlFor='confirmpassword' className='form-label'>Confirm Password</label>
                <input type='password' name='confirmpassword' className='form-control' placeholder='Re-enter Your Password'
                  value={confirmPassword} onChange={this.handleChange('confirmPassword')} />
              </div>
            </div>


            <div className='row mt-3'>
              <div className='col'>
                <label htmlFor='role' className='form-label'>Role</label>
                <select className="form-select" value={roleId} onChange={this.handleChange('roleId')}>
                  <option value=''>Select Your Role</option>
                  {roles.map((r) => (
                    <option key={r.roleId} value={r.roleId}>{r.roleName}</option>
                  ))}
                </select>
              </div>

              <div className='col'>
                <label htmlFor='department' className='form-label'>Department</label>
                <select className="form-select" value={departmentId} onChange={this.handleChange('departmentId')}>
                  <option value=''>Select Your Department</option>
                  {departments.map((d) => (
                    <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>
                  ))}
                </select>
              </div>
            </div>


            <div className='row mt-3'>
              <div className='col'>
                <input type='reset' className='btn btn-warning' onClick={this.handleReset} />
                <input type='submit' className='btn btn-success mx-3' value={submitting ? 'Registering...' : 'Register'} disabled={submitting} />
              </div>
            </div>

            <div className='row mt-3'>
              <p>Already registered? <a href='employee-login'>Login Now</a></p>
            </div>
          </form>
        </div>

        <Footer />
      </>
    )
  }
}

export default EmployeeRegister
