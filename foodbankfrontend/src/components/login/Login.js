import { useState } from "react"
import { Link } from "react-router-dom"

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const login = () => {
        const userData = {
            "password": password,
            "username": username
        }
        console.log("Log in " + userData.username + " " + userData.password)
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={login}>
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
            <p>Don't have an account? <Link to="/signup/">Log in</Link></p>
        </div>
    )
}

export default Login