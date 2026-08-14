import React from 'react'
import { Navigate } from 'react-router-dom'
import { getSession } from '../auth'


export function ProtectedRoute({ role, redirectTo, children }) {
    const session = getSession()
    const hasToken = !!session?.token

    const allowed = role === 'Admin'
        ? hasToken && session.role === 'Admin'
        : hasToken && session.role !== 'Admin'

    if (!allowed) {
        return <Navigate to={redirectTo} replace />
    }

    return children
}

export default ProtectedRoute
