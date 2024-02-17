import axios from "axios"
import { toast } from "react-toastify"
import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import AuthenticationContext from "../../contextProviders/authentication/AuthenticationContext.jsx"


const Signup = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { 
        createUserStatus,
        usernameError,
        passwordError,
        isSubmitted,
        handleCreateUserSubmitted,
        handleCreateUserError,
        handleCreateUserSuccess
    } = useContext(AuthenticationContext)

    const signupNewUser = () => {
        const userData = {
            "password": password,
            "username": username
        }
        console.log("Sign up " + userData.username + " " + userData.password)
        handleCreateUserSubmitted()
        axios.post("/api/auth/v1/users/", userData)
        .then((response) => {
            toast.success(
                "Account for " +
                userData.username +
                " created successfully. Please login."
            )
            handleCreateUserSuccess()
        })
        .catch((error) => {
            if (error.response){
                toast.error(JSON.stringify(error.response.data))
                handleCreateUserError(error.response.data)
            } else if (error.message){
                toast.error(JSON.stringify(error.message));
            } else {
                toast.error(JSON.stringify(error));
            }
        })
        return false
    }

    return (
        <div>
            <h1>Sign up</h1>
            <form onSubmit={(event) => {
                // Prevents form from default submission behavior
                event.preventDefault();
                signupNewUser()
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
                <button type="submit">Sign up</button>
            </form>
            <p>Already have an account? <Link to="/login/">Log in</Link></p>
        </div>
    )
}

export default Signup