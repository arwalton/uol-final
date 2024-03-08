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
            <nav role="navigation" class="navbar is-fixed-top is-primary" aria-label="main navigation">
                <div class="navbar-brand">
                    
                </div>
                <div class="navbar-menu">
                    <div class="navbar-start">
                        <Link to="/" class="navbar-item">Home</Link>
                        <Link to="/dashboard" class="navbar-item">Dashboard</Link>
                        <Link to="/create-order" class="navbar-item">New order</Link>
                    </div>

                    <div class="navbar-end">
                        <div class="navbar-item">
                            {isAuthenticated ? (
                                <button class="button is-light" onClick={logout}>Log out</button>
                            ) : (
                            <div class="buttons">
                                <Link to="/signup" class="button is-primary">Sign up</Link>
                                <Link to="/login" class="button is-light">Log in</Link>
                            </div>
                            )}
                            
                        </div>
                    </div>
                </div>
            </nav>
            <div class="box">
                { children }
            </div>

        </div>
    )
}

export default Header