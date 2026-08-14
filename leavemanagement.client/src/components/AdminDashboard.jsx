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

export class AdminDashboard extends Component {
    constructor() {
        super();
        this.session = getSession();

        this.state = {
            activeTab: 'leaves',

            // Leave approvals tab
            requests: [],
            requestsError: '',
            loadingRequests: true,
            actioningId: null,
            commentDrafts: {},

            // Manager assignment tab
            users: [],
            managers: [],
            employee: "",
            manager: "",
            assignError: '',
            assignSuccess: '',
            loadingUsers: true
        }
    }

    componentDidMount() {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation?.type === 'reload') {
            clearSession();
            window.location.href = '/';
            return;
        }
        this.loadRequests();
        this.loadUsersAndManagers();
    }

    loadRequests = async () => {
        this.setState({ loadingRequests: true, requestsError: '' });
        try {
            const requests = await apiFetch('/leaverequests/all');
            this.setState({ requests, loadingRequests: false });
        } catch (err) {
            this.setState({ requestsError: err.message, loadingRequests: false });
        }
    }

    loadUsersAndManagers = async () => {
        this.setState({ loadingUsers: true });
        try {
            const [users, managers] = await Promise.all([
                apiFetch('/admin/users'),
                apiFetch('/admin/managers')
            ]);
            this.setState({ users, managers, loadingUsers: false });
        } catch (err) {
            this.setState({ assignError: err.message, loadingUsers: false });
        }
    }

    handleLogout = () => {
        clearSession();
        window.location.href = '/';
    }

    handleCommentChange = (requestId) => (e) => {
        this.setState({
            commentDrafts: { ...this.state.commentDrafts, [requestId]: e.target.value }
        });
    }

    handleDecision = (requestId, status) => async () => {
        this.setState({ actioningId: requestId, requestsError: '' });

        try {
            await apiFetch('/leaverequests/process-approval', {
                method: 'POST',
                body: JSON.stringify({
                    leaveRequestId: requestId,
                    status,
                    managerComment: this.state.commentDrafts[requestId] || ''
                })
            });

            await this.loadRequests();
        } catch (err) {
            this.setState({ requestsError: err.message });
        } finally {
            this.setState({ actioningId: null });
        }
    }

    renderLeavesTab() {
        const { requests, requestsError, loadingRequests, actioningId, commentDrafts } = this.state;

        if (loadingRequests) return <p>Loading leave requests...</p>;

        return (
            <>
                {requestsError && <div className='alert alert-danger'>{requestsError}</div>}

                <table className='table table-striped mt-3'>
                    <thead>
                        <tr>
                            <th className='table-success'>Employee</th>
                            <th className='table-success'>Department</th>
                            <th className='table-success'>Leave Type</th>
                            <th className='table-success'>Start</th>
                            <th className='table-success'>End</th>
                            <th className='table-success'>Days</th>
                            <th className='table-success'>Reason</th>
                            <th className='table-success'>Status</th>
                            <th className='table-success'>Comment</th>
                            <th className='table-success'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length === 0 && (
                            <tr><td colSpan='10' className='text-center text-muted'>No leave requests found.</td></tr>
                        )}
                        {requests.map((r) => (
                            <tr key={r.leaveRequestId}>
                                <td>{r.employeeName}</td>
                                <td>{r.department || '-'}</td>
                                <td>{r.leaveTypeName}</td>
                                <td>{new Date(r.startDate).toLocaleDateString()}</td>
                                <td>{new Date(r.endDate).toLocaleDateString()}</td>
                                <td>{r.numberOfDays}</td>
                                <td>{r.reason}</td>
                                <td><span className={statusBadge(r.status)}>{r.status}</span></td>
                                <td>
                                    {r.status === 'Pending' ? (
                                        <input
                                            type='text'
                                            className='form-control form-control-sm'
                                            placeholder='Optional comment'
                                            value={commentDrafts[r.leaveRequestId] || ''}
                                            onChange={this.handleCommentChange(r.leaveRequestId)}
                                        />
                                    ) : (r.managerComment || '-')}
                                </td>
                                <td>
                                    {r.status === 'Pending' ? (
                                        <>
                                            <button
                                                className='btn btn-success btn-sm mx-1'
                                                disabled={actioningId === r.leaveRequestId}
                                                onClick={this.handleDecision(r.leaveRequestId, 'Approved')}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className='btn btn-danger btn-sm'
                                                disabled={actioningId === r.leaveRequestId}
                                                onClick={this.handleDecision(r.leaveRequestId, 'Rejected')}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    ) : (
                                        <span className='text-muted'>Reviewed</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
        )
    }

    renderAssignTab() {
        const { users, managers, employee, manager, assignError, assignSuccess, loadingUsers } = this.state;

        const assignEmployee = async () => {
            this.setState({ assignError: '', assignSuccess: '' });

            if (employee === "" || manager === "") {
                this.setState({ assignError: 'Please select both a manager and an employee.' });
                return;
            }

            if (employee === manager) {
                this.setState({ assignError: "Employee and Manager can't be the same person." });
                return;
            }

            try {
                await apiFetch(`/admin/users/${employee}/manager`, {
                    method: 'PUT',
                    body: JSON.stringify({ managerId: parseInt(manager, 10) })
                });

                this.setState({ assignSuccess: 'Manager assigned successfully.', employee: '', manager: '' });
                this.loadUsersAndManagers();
            } catch (err) {
                this.setState({ assignError: err.message });
            }
        }

        if (loadingUsers) return <p>Loading employees...</p>;

        return (
            <>
                {assignError && <div className='alert alert-danger'>{assignError}</div>}
                {assignSuccess && <div className='alert alert-success'>{assignSuccess}</div>}

                <div className='row mt-3'>
                    <div className='col'>
                        <label htmlFor='manager' className='form-label'>Select a Manager</label>
                        <select className="form-select" value={manager} onChange={(e) => this.setState({ manager: e.target.value })}>
                            <option value=''>-- Select Manager --</option>
                            {managers.map((m) => (
                                <option key={m.userId} value={m.userId}>
                                    {m.firstName} {m.lastName} ({m.department || 'No Dept'})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='col'>
                        <label htmlFor='employee' className='form-label'>Select an Employee</label>
                        <select className="form-select" value={employee} onChange={(e) => this.setState({ employee: e.target.value })}>
                            <option value=''>-- Select Employee --</option>
                            {users.map((u) => (
                                <option key={u.userId} value={u.userId}>
                                    {u.firstName} {u.lastName} ({u.role})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className='row mt-3 d-flex justify-content-center align-items-center'>
                    <button className='btn btn-success w-50' onClick={assignEmployee}>Assign</button>
                </div>

                <div className='row mt-5'>
                    <table className="table">
                        <thead>
                            <tr>
                                <th className='table-success'>Employee</th>
                                <th className='table-success'>Role</th>
                                <th className='table-success'>Department</th>
                                <th className='table-success'>Current Manager</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((u) => (
                                <tr key={u.userId}>
                                    <td>{u.firstName} {u.lastName}</td>
                                    <td>{u.role}</td>
                                    <td>{u.department || '-'}</td>
                                    <td>{u.managerName || <span className='text-muted'>Unassigned</span>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        )
    }

    render() {
        const { activeTab } = this.state;

        return (
            <>
                <div className='container mt-3' style={{ paddingBottom: '4rem' }}>
                    <div className='d-flex justify-content-between align-items-center'>
                        <h1 className='alert alert-success flex-grow-1 me-3'>
                            Admin Dashboard{this.session?.firstName ? ` - ${this.session.firstName} ${this.session.lastName}` : ''}
                        </h1>
                        <button className='btn btn-outline-danger' onClick={this.handleLogout}>Logout</button>
                    </div>

                    <ul className='nav nav-tabs mt-3'>
                        <li className='nav-item'>
                            <button
                                className={`nav-link ${activeTab === 'leaves' ? 'active' : ''}`}
                                onClick={() => this.setState({ activeTab: 'leaves' })}
                            >
                                Leave Requests
                            </button>
                        </li>
                        <li className='nav-item'>
                            <button
                                className={`nav-link ${activeTab === 'assign' ? 'active' : ''}`}
                                onClick={() => this.setState({ activeTab: 'assign' })}
                            >
                                Assign Managers
                            </button>
                        </li>
                    </ul>

                    <div className='tab-content mt-3'>
                        {activeTab === 'leaves' ? this.renderLeavesTab() : this.renderAssignTab()}
                    </div>
                </div >

                <Footer />
            </>
        )
    }
}

export default AdminDashboard