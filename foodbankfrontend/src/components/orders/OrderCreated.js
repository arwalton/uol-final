import { Link } from "react-router-dom"
import AuthenticationContext from "../../contextProviders/authentication/AuthenticationContext.jsx"
import { useContext } from "react"
import Header from "../header/Header.js"

const OrderCreated = () => {
    const { createUserStatus } = useContext(AuthenticationContext)
    console.log("OrderCreated element createUserStatus", createUserStatus)

    return (
        <div>
            <Header />
            <div class="box">
                <h1 class="is-size-1">Create new Order</h1>
                <h1>Order sucessfully created</h1>
                <Link to="/dashboard/">Dashboard</Link>
            </div>
        </div>
    )
}

export default OrderCreated