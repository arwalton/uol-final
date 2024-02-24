import OrderList from "../orders/OrderList"
import CreateOrder from "../orders/CreateOrder"


const Dashboard = () => {

    return (
        <div>
            <h1>Dashboard</h1>
            <OrderList />
            <CreateOrder />
        </div>
    )
}

export default Dashboard