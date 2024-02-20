import axios from "axios"
import { useState, useContext } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { setAxiosAuthToken, toastOnError } from "../../utils/Utils"
import AuthenticationContext from "../../contextProviders/authentication/AuthenticationContext.jsx";

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { 
        handleSetToken,
        handleSetCurrentUser
    } = useContext(AuthenticationContext)
    const navigate = useNavigate()
    const location = useLocation()

    const login = () => {
        const userData = {
            "password": password,
            "username": username
        }
        console.log("locationState", location.state)
        console.log("Log in " + userData.username + " " + userData.password)

        axios.post("/api/auth/v1/token/login/", userData)
        .then(response => {
            const { auth_token } = response.data
            setAxiosAuthToken(auth_token)
            handleSetToken(auth_token)
            getCurrentUser()
        })
        .catch(error => {
            handleSetCurrentUser(undefined)
            toastOnError(error)
        })
    }

    const getCurrentUser = () => {
        axios.get("/api/auth/v1/users/me/")
        .then(response => {
            const user = {
                username: response.data.username,
                email: response.data.email
            }
            const redirectTo = location.state && location.state.redirectTo ? location.state.redirectTo : ""
            console.log("redirectTo", redirectTo)
            handleSetCurrentUser(user, redirectTo)
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