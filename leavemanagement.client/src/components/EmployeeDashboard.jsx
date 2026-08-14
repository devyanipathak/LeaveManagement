import React, { Component } from 'react'
import Footer from './Footer'
import apiFetch from '../api'
import { getSession, clearSession } from '../auth'

const statusBadge = (status) => {
  switch (status) {
    case 'Approved': return 'badge bg-success';
    case 'Rejected': return 'badge bg-danger';
    default: return 'badge bg-warning text-dark';
  }
}

export class EmployeeDashboard extends Component {
  constructor() {
    super();
    this.session = getSession();

    this.state = {
      balances: [],
      history: [],
      leaveTypes: [],
      holidays: [],
      leaveTypeId: '',
      startDate: '',
      endDate: '',
      reason: '',
      error: '',
      formError: '',
      success: '',
      loading: true,
      submitting: false
    }
  }

  componentDidMount() {
    this.loadAll();
  }

  loadAll = async () => {
    const userId = this.session?.userId;
    if (!userId) return;

    this.setState({ loading: true, error: '' });

    try {
      const [balances, history, leaveTypes, holidays] = await Promise.all([
        apiFetch(`/leaverequests/balances/${userId}`),
        apiFetch(`/leaverequests/history/${userId}`),
        apiFetch('/leaverequests/leave-types'),
        apiFetch('/lookup/holidays')
      ]);

      this.setState({ balances, history, leaveTypes, holidays, loading: false });
    } catch (err) {
      this.setState({ error: err.message, loading: false });
    }
  }

  handleChange = (field) => (e) => {
    this.setState({ [field]: e.target.value });
  }

  handleLogout = () => {
    clearSession();
    window.location.href = '/';
  }

  handleApply = async (e) => {
    e.preventDefault();
    this.setState({ formError: '', success: '' });

    const { leaveTypeId, startDate, endDate, reason } = this.state;
    const userId = this.session?.userId;

    if (!leaveTypeId || !startDate || !endDate) {
      this.setState({ formError: 'Please select a leave type and both dates.' });
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      this.setState({ formError: 'End date cannot be before the start date.' });
      return;
    }

    this.setState({ submitting: true });

    try {
      await apiFetch('/leaverequests/submit', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          leaveTypeId: parseInt(leaveTypeId, 10),
          startDate,
          endDate,
          reason
        })
      });

      this.setState({
        success: 'Leave request submitted and is pending review.',
        leaveTypeId: '',
        startDate: '',
        endDate: '',
        reason: '',
        submitting: false
      });

      this.loadAll();
    } catch (err) {
      this.setState({ formError: err.message, submitting: false });
    }
  }

  componentDidMount() {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation?.type === 'reload') {
      clearSession();
      window.location.href = '/';
      return;
    }
    this.loadAll();
  }

  render() {
    const {
      balances, history, leaveTypes, holidays,
      leaveTypeId, startDate, endDate, reason,
      error, formError, success, loading, submitting
    } = this.state;

    const upcomingHolidays = holidays
      .filter(h => new Date(h.holidayDate) >= new Date(new Date().toDateString()))
      .slice(0, 5);

    return (
      <>
        <div className='container mt-3' style={{ paddingBottom: '4rem' }}>
          <div className='d-flex justify-content-between align-items-center'>
            <h1 className='alert alert-success flex-grow-1 me-3'>
              Welcome, {this.session?.firstName} {this.session?.lastName}
            </h1>
            <button className='btn btn-outline-danger' onClick={this.handleLogout}>Logout</button>
          </div>

          {error && <div className='alert alert-danger'>{error}</div>}

          {loading ? (
            <p>Loading your dashboard...</p>
          ) : (
            <>
              {/* Leave Balances */}
              <h3 className='mt-4'>Leave Balances ({new Date().getFullYear()})</h3>
              <div className='row g-3'>
                {balances.length === 0 && <p className='text-muted'>No leave balances found.</p>}
                {balances.map((b) => (
                  <div className='col-md-3' key={b.leaveBalanceId}>
                    <div className='card shadow-sm h-100'>
                      <div className='card-body'>
                        <h5 className='card-title'>{b.leaveTypeName}</h5>
                        <p className='mb-1'>Allocated: <strong>{b.allocatedDays}</strong></p>
                        <p className='mb-1'>Used: <strong>{b.usedDays}</strong></p>
                        <p className='mb-0'>Remaining: <strong className='text-success'>{b.remainingDays}</strong></p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Apply for Leave */}
              <h3 className='mt-5'>Apply for Leave</h3>
              {formError && <div className='alert alert-danger'>{formError}</div>}
              {success && <div className='alert alert-success'>{success}</div>}

              <form onSubmit={this.handleApply} className='card p-3 shadow-sm'>
                <div className='row'>
                  <div className='col-md-4'>
                    <label className='form-label'>Leave Type</label>
                    <select className='form-select' value={leaveTypeId} onChange={this.handleChange('leaveTypeId')}>
                      <option value=''>Select Leave Type</option>
                      {leaveTypes.map((lt) => (
                        <option key={lt.leaveTypeId} value={lt.leaveTypeId}>{lt.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className='col-md-3'>
                    <label className='form-label'>Start Date</label>
                    <input type='date' className='form-control' value={startDate} onChange={this.handleChange('startDate')} />
                  </div>

                  <div className='col-md-3'>
                    <label className='form-label'>End Date</label>
                    <input type='date' className='form-control' value={endDate} onChange={this.handleChange('endDate')} />
                  </div>

                  <div className='col-md-2 d-flex align-items-end'>
                    <button type='submit' className='btn btn-success w-100' disabled={submitting}>
                      {submitting ? 'Submitting...' : 'Apply'}
                    </button>
                  </div>
                </div>

                <div className='row mt-3'>
                  <div className='col'>
                    <label className='form-label'>Reason</label>
                    <textarea className='form-control' rows='2' value={reason}
                      onChange={this.handleChange('reason')} placeholder='Briefly describe the reason for leave' />
                  </div>
                </div>
              </form>

              {/* Leave History */}
              <h3 className='mt-5'>My Leave History</h3>
              <table className='table table-striped'>
                <thead>
                  <tr>
                    <th>Leave Type</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Days</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Manager Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 && (
                    <tr><td colSpan='7' className='text-center text-muted'>No leave requests yet.</td></tr>
                  )}
                  {history.map((h) => (
                    <tr key={h.leaveRequestId}>
                      <td>{h.leaveTypeName}</td>
                      <td>{new Date(h.startDate).toLocaleDateString()}</td>
                      <td>{new Date(h.endDate).toLocaleDateString()}</td>
                      <td>{h.numberOfDays}</td>
                      <td>{h.reason}</td>
                      <td><span className={statusBadge(h.status)}>{h.status}</span></td>
                      <td>{h.managerComment || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Upcoming Holidays */}
              {upcomingHolidays.length > 0 && (
                <>
                  <h3 className='mt-5'>Upcoming Company Holidays</h3>
                  <ul className='list-group mb-5'>
                    {upcomingHolidays.map((h) => (
                      <li className='list-group-item d-flex justify-content-between' key={h.holidayId}>
                        <span>{h.holidayName}</span>
                        <span className='text-muted'>{new Date(h.holidayDate).toLocaleDateString()}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
        </div>

        <Footer />
      </>
    )
  }
}

export default EmployeeDashboard
