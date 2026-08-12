import React, { Component } from 'react'
import Footer from './Footer'

export class Home extends Component {
    render() {
        return (
            <>
                <div className='container mt-5'>
                    <h1 className='alert alert-success text-center py-3 fs-2'>Home</h1>
                    <div className="container px-4 my-5">
                        <div className="row g-5">
                            <div className="col-lg-6">
                                <div className="card h-100 shadow-lg border-primary border-4 bg-light p-5 rounded-4">
                                    <div className="card-body d-flex flex-column justify-content-between py-4">
                                        <div>
                                            <h2 className="card-title text-primary display-5 fw-bold mb-4">Employee Portal</h2>
                                            <p className="text-muted fs-5 mb-4">Access your profile, and leaves</p>
                                        </div>
                                        <a href="employee-login" className='btn btn-outline-primary btn-lg py-3 fs-5 fw-semibold'>Go to Employee Portal</a>
                                    </div>
                                </div>
                            </div>



                            <div className="col-lg-6">
                                <div className="card h-100 shadow-lg border-success border-4 bg-light p-5 rounded-4">
                                    <div className="card-body d-flex flex-column justify-content-between py-4">
                                        <div>
                                            <h2 className="card-title text-success display-5 fw-bold mb-4">Manager Dashboard</h2>
                                            <p className="text-muted fs-5 mb-4">Manage employee leave requests</p>
                                        </div>
                                        <a href="manager-login" className='btn btn-outline-success btn-lg py-3 fs-5 fw-semibold'>Go to Manager Dashboard</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </>
        )
    }
}

export default Home