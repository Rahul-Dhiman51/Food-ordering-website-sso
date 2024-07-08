import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks'
import { Children } from 'react'

const AuthRoute = ({ children }) => {

    const location = useLocation()
    // console.log(location)
    const { user } = useAuth()

    return (
        user ? (
            children
        ) : (
            <Navigate to={`/login?returnUrl=${location.pathname}`} replace />
        )
    )
}

export default AuthRoute