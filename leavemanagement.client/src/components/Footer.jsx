import React, { Component } from 'react'

export class Footer extends Component {
    render() {
        return (
            <div className="bg-dark text-light py-3 mt-auto fixed-bottom">
                <div className="container text-center">
                    <p className="mb-0">&copy; 2026 Leave Management System. All rights reserved.</p>
                </div>
            </div>
        )
    }
}

export default Footer