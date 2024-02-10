import { Link } from "react-router-dom"
import AuthenticationContext from "../../contextProviders/authentication/AuthenticationContext.jsx"
import { useContext } from "react"

const Home = () => {
    const { createUserStatus } = useContext(AuthenticationContext)
    console.log("Home element createUserStatus", createUserStatus)

    return (
        <div>
            <h1>Home</h1>
            <Link to="/login/">Log in</Link>
            <br />
            <Link to="/signup/">Sign up</Link>
            <br />
            <Link to="/dashboard/">Dashboard</Link>
            <br />

        </div>
    )
}

export default Home