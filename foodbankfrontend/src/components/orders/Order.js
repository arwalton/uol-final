import { useEffect } from "react"

const Order = ({order}) => {

    const orderItems = order.orderItems.map((orderItem, index) => {
        return (
            <li key={index}>
                <p>{orderItem.item + ': ' + orderItem.amountRemaining + ' ' + orderItem.unit} </p>
            </li>
        )
    })

    useEffect(() => {
        console.log('order', order)
    })

    return (
        <div>
            <p>Creation Date: { order.creationDate }</p>
            <p>Expiration Date: { order.expirationDate }</p>
            <p>Status: { order.status }</p>
            <p>Order Items:</p>
            <ul>
                { orderItems }
            </ul>

        </div>
    )
}

export default Order