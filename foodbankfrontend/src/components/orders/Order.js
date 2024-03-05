import { useState } from "react"
import { ORDER_STATUS } from "../../enums/orderStatus"
import { updateOrder } from "./OrderActions"
import { toastOnError } from "../../utils/Utils"
import OrderItem from "./OrderItem"

const Order = ({order}) => {
    const [displayStatus, setDisplayStatus] = useState(order.status)
    const [isUpdating, setIsUpdating] = useState(false)

    const orderItems = order.orderItems.map((orderItem, index) => {
        return (
            <li key={index}>
                <OrderItem 
                    orderItem={orderItem}
                    key={index}
                />
            </li>
        )
    })

    const updateStatus = () => {
        setIsUpdating(true)
        console.log("updateStatus")
        switch(displayStatus) {
            case ORDER_STATUS.OPEN:
                setDisplayStatus(ORDER_STATUS.CLOSED)
                updateOrder(order.id, {...order, status: ORDER_STATUS.CLOSED})
                .then(response => {
                    setIsUpdating(false)
                })
                .catch(error => {
                    toastOnError(error)
                })
                break
            case ORDER_STATUS.CLOSED:
                setDisplayStatus(ORDER_STATUS.EXPIRED)
                updateOrder(order.id, {...order, status: ORDER_STATUS.EXPIRED})
                .then(response => {
                    setIsUpdating(false)
                })
                .catch(error => {
                    toastOnError(error)
                })
                break
            case ORDER_STATUS.EXPIRED:
                setDisplayStatus(ORDER_STATUS.FULFILLED)
                updateOrder(order.id, {...order, status: ORDER_STATUS.FULFILLED})
                .then(response => {
                    setIsUpdating(false)
                })
                .catch(error => {
                    toastOnError(error)
                })
                break
            case ORDER_STATUS.FULFILLED:
                setDisplayStatus(ORDER_STATUS.OPEN)
                updateOrder(order.id, {...order, status: ORDER_STATUS.OPEN})
                .then(response => {
                    setIsUpdating(false)
                })
                .catch(error => {
                    toastOnError(error)
                })
                break
            default:
                setDisplayStatus(ORDER_STATUS.OPEN)
                break
        }
    }

    const formatdisplayStatus = () => {
        switch(displayStatus) {
            case ORDER_STATUS.OPEN:
                return "Open"
            case ORDER_STATUS.CLOSED:
                return "Closed"
            case ORDER_STATUS.EXPIRED:
                return "Expired"
            case ORDER_STATUS.FULFILLED:
                return "Fulfilled"
            default:
                return "Error getting status"
        }
    }

    return (
        <div>
            <p>Creation Date: { order.creationDate }</p>
            <p>Expiration Date: { order.expirationDate }</p>
            <div>
                <p>Status: { formatdisplayStatus() }</p>
                <button
                    type="button"
                    onClick={updateStatus}
                    disabled={isUpdating}
                >Update Status</button>
            </div>
            <p>Order Items:</p>
            <ul>
                { orderItems }
            </ul>

        </div>
    )
}

export default Order