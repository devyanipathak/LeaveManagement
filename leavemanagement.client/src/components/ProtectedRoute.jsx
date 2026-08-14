import React from 'react'
import { Navigate } from 'react-router-dom'
import { getSession } from '../auth'

// Wrap a dashboard route with this to bounce anonymous visitors back
// to the matching login page. `role` is either "Admin" (checked
// against the admin JWT) or the special value "Employee", which
// accepts any non-Admin authenticated role (Project Manager,
// Application Developer, Software Engineer, ...).
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
