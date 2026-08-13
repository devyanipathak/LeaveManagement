import React, { Component } from 'react'
import Footer from './Footer'

export class AdminDashboard extends Component {
    constructor() {
        super();

        this.state = {
            employee: "",
            manager: ""
        }
    }


    render() {
        const employees = ["", "Ankush Mallick", "Ram Sharma", "Shyam Chowdhury"]

        const assignEmployee = () => {
            if (this.state.employee == "" || this.state.manager == "") {
                alert("Please select manager and employee");
                return;
            }

        }

        return (
            <>
                <div className='container mt-3'>
                    <h1 className='alert alert-success'>Admin Dashboard</h1>

                    <div className='row mt-3'>
                        <div className='col'>
                            <label htmlFor='manager' className='form-label'>Select a Manager</label>
                            <select className="form-select" value={this.state.manager} onChange={(e) => this.setState({ manager: e.target.value })}>
                                {employees.map((element, key) => (
                                    <option key={key} value={element} >
                                        {element}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='col'>
                            <label htmlFor='employee' className='form-label'>Select an Employee</label>
                            <select className="form-select" value={this.state.employee} onChange={(e) => this.setState({ employee: e.target.value })}>
                                {employees.map((element, key) => (
                                    <option key={key} value={element} >
                                        {element}
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
                                    <th className='table-success'>Id</th>
                                    <th className='table-success'>Manager Name</th>
                                    <th className='table-success'>Employye Name</th>
                                    <th className='table-success'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>1</th>
                                    <td>Mark</td>
                                    <td>Otto</td>
                                    <td>
                                        <button className="btn btn-warning mx-2">Edit</button>
                                        <button className="btn btn-danger">Delete</button>
                                    </td>
                                </tr>
                                <tr>
                                    <th>2</th>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div >

                <Footer />
            </>
        )
    }
}

export default AdminDashboard