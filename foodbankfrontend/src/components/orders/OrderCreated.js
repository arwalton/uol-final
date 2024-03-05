import { Link } from "react-router-dom"
import AuthenticationContext from "../../contextProviders/authentication/AuthenticationContext.jsx"
import { useContext } from "react"

const OrderCreated = () => {
    const { createUserStatus } = useContext(AuthenticationContext)
    console.log("OrderCreated element createUserStatus", createUserStatus)

    return (
        <div>
            <h1>Order sucessfully created</h1>
            <Link to="/dashboard/">Dashboard</Link>

        </div>
    )
}

export default OrderCreated