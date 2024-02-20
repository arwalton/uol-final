import AuthenticationContext from "../../contextProviders/authentication/AuthenticationContext.jsx";
import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";
import { toastOnError } from "../../utils/Utils"
import { toast } from "react-toastify"


const Header = ({ children }) => {
    const {
        currentUser,
        isAuthenticated,
        handleSetCurrentUser,
    } = useContext(AuthenticationContext)
    const navigate = useNavigate()
    
    const logout = () => {
        axios.post("/api/auth/v1/token/logout/")
        .then(response => {
            handleSetCurrentUser(undefined)
            toast.success("Logout successful.")
            navigate("/")
        })
        .catch(error => {
            handleSetCurrentUser(undefined)
            toastOnError(error)
        })
    }

    return (
        <div>
            {isAuthenticated ? (
                <>
                    <p>Hello {currentUser.username}!</p>
                    <Link to="/">Home</Link>
                    <br />
                    <button onClick={logout}>logout</button>
                </>
            ):(
                <p>User Not logged in</p>
            )}
            <hr/>
            { children }
        </div>
    )
}

export default Header