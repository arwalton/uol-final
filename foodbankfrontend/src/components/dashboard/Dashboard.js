import OrderList from "../orders/OrderList"
import Header from "../header/Header"


const Dashboard = () => {

    return (
        <div>
            <Header />
            <div class="box">
                <h1 class="is-size-1">Dashboard</h1>
                <OrderList />
            </div>
        </div>
    )
}

export default Dashboard