import { Link } from "react-router-dom"
import AuthenticationContext from "../../contextProviders/authentication/AuthenticationContext.jsx"
import { useContext } from "react"
import Header from "../header/Header.js"

const Home = () => {
    const { createUserStatus } = useContext(AuthenticationContext)
    console.log("Home element createUserStatus", createUserStatus)

    return (
        <div>
            <Header />
            <div class="box">
                <h1 class="is-size-1">Home</h1>
                <Link to="/login/">Log in</Link>
                <br />
                <Link to="/signup/">Sign up</Link>
                <br />
            </div>
        </div>
    )
}

export default Home