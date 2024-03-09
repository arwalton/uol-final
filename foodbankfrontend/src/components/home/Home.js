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
                <h1 class="is-size-1">Welcome to the food pantry ordering system</h1>
                <p>Before you get started, makes sure to <Link to="/login/">log in</Link> or <Link to="/signup/">sign up</Link>.</p>
                <p>After that, vist the <Link to="/dashboard/">dashboard</Link> to see your current orders.</p>
                <p>Or you can make a new order <Link to="create-order">here</Link>.</p>
            </div>
        </div>
    )
}

export default Home