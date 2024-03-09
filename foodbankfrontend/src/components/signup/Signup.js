import axios from "axios"
import { toast } from "react-toastify"
import { useContext, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import AuthenticationContext from "../../contextProviders/authentication/AuthenticationContext.jsx"
import Header from "../header/Header.js"
import { getDistributors } from "../orders/OrderActions.js"
import { toastOnError } from "../../utils/Utils.js"

const Signup = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [organization, setOrganization] = useState("")
    const [error, setError] = useState("")
    const [distributors, setDistributors] = useState([])
    const { 
        createUserStatus,
        usernameError,
        passwordError,
        isSubmitted,
        handleCreateUserSubmitted,
        handleCreateUserError,
        handleCreateUserSuccess
    } = useContext(AuthenticationContext)

    useEffect(() => {
        let ignore = false
        getDistributors()
        .then(response => {
            if(!ignore){
                console.log('response', response)
                setDistributors(response.data)
            }
        })
        .catch(error => {
            toastOnError(error)
        })

        return () => {
            ignore = true
        }
    }, [])

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

    const distributorInputFields = distributors.map((distributor, index) => {
        return (
            <option value={distributor.name}>{distributor.name}</option>
        )
    })

    return (
        <div>
            <Header />
            <div class="box">
                <h1 class="is-size-1">Sign up</h1>
                <form onSubmit={(event) => {
                    // Prevents form from default submission behavior
                    event.preventDefault();
                    signupNewUser()
                }}>
                    <div class="field">
                        <label class="label" htmlFor="username">Username</label>
                        <input class="input" type="text" id="username" name="username" value={username} onChange={(e)=>setUsername(e.target.value)} />
                    </div>
                    <div className="field">
                        <label class="label" htmlFor="username">Password</label>
                        <input class="input" type="password" id="password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                    </div>
                    <div class="field">
                        <label class="label" for="organization">What organization are you with?</label>
                        <div class="select">
                            <select
                                name="organization"
                                id="organization"
                                onChange={(e) => setOrganization(e.target.value)}
                            >
                                <option value=''></option>
                                {distributorInputFields}
                            </select>
                        </div>
                    </div>
                    <div>
                        {error &&
                        <small>
                            {error}
                        </small>
                        }
                    </div>
                    <button class="button is-link" type="submit">Sign up</button>
                </form>
                <p>Already have an account? <Link to="/login/">Log in</Link></p>
            </div>
        </div>
    )
}

export default Signup