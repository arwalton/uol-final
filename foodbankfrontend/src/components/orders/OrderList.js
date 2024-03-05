import { useContext, useEffect, useState } from "react"
import { getOrders } from "./OrderActions"
import OrderContext from "../../contextProviders/orders/OrderContext"
import { toastOnError } from "../../utils/Utils"
import Order from "./Order"

const OrderList = () => {
    const { orders, handleAddMultipleOrders} = useContext(OrderContext)
    const [ orderMap, setOrderMap ] = useState()

    useEffect(() => {
        let ignore = false
        getOrders()
        .then(response => {
            if(!ignore){
                console.log('response', response)
                handleAddMultipleOrders(response.data)
            }
        })
        .catch(error => {
            toastOnError(error)
        })

        return () => {
            ignore = true
        }
    }, [])

    useEffect(() => {
        console.log('orders', orders)
        setOrderMap(orders.map((order, index) => {
            return (
                <Order
                    order={order}
                    key={index} 
                />
            )
        }))
    }, [orders])

    

    return (
        <div>
            <h2>Order List</h2>
            <ul>
                {orderMap}
            </ul>
        </div>
    )

}

export default OrderList