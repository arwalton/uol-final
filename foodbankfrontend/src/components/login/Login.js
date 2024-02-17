import axios from "axios"
import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { setAxiosAuthToken, toastOnError } from "../../utils/Utils"
import AuthenticationContext from "../../contextProviders/authentication/AuthenticationContext.jsx";
import { toast } from "react-toastify"

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { 
        currentUser,
        token,
        isAuthenticated,
        handleSetToken,
        handleSetCurrentUser
    } = useContext(AuthenticationContext)
    const navigate = useNavigate()

    const login = (redirectTo) => {
        const userData = {
            "password": password,
            "username": username
        }
        console.log("Log in " + userData.username + " " + userData.password)

        axios.post("/api/auth/v1/token/login/", userData)
        .then(response => {
            const { auth_token } = response.data
            setAxiosAuthToken(auth_token)
            handleSetToken(auth_token)
            getCurrentUser(redirectTo)
        })
        .catch(error => {
            handleSetCurrentUser(undefined)
            toastOnError(error)
        })
    }

    const getCurrentUser = (redirectTo) => {
        axios.get("/api/auth/v1/users/me/")
        .then(response => {
            const user = {
                username: response.data.username,
                email: response.data.email
            }
        handleSetCurrentUser(user, redirectTo)
        })
    }

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
            <h1>Login</h1>
            <form onSubmit={(event) => {
                // Prevents form from default submission behavior
                event.preventDefault();
                login()
            }}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" value={username} onChange={(e)=>setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="username">Password</label>
                    <input type="password" id="password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                <div>
                    {error &&
                    <small>
                        {error}
                    </small>
                    }
                </div>
                </div>
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <Link to="/signup/">Sign up</Link></p>
        </div>
    )
}

export default Login