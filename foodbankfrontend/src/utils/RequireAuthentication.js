import { useContext, useEffect } from "react"
import AuthenticationContext from "../contextProviders/authentication/AuthenticationContext.jsx";
import { useNavigate } from "react-router-dom"

const RequireAuthentication = ({ children }) => {
    const { isAuthenticated } = useContext(AuthenticationContext)
    const navigate = useNavigate()

    useEffect(() => {
        if(!isAuthenticated){
            navigate("/login", {state: {redirectTo: window.location.pathname}})
        }
    })

    return (
        <>
            {isAuthenticated? (
                children
            ):(
                null
            )}
        </>
    )

}

export default RequireAuthentication