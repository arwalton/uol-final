import { createContext, useState } from 'react'

const OrderContext = createContext({
    orders: []
})

export const OrderContextProvider = ({children}) => {
    const [orders, setOrders] = useState([])

    const handleAddOrder = (orderToAdd) => {
        console.log("handleAddOrder called")
        const newOrdersAray = filterUnique([...orders, orderToAdd], item => item.creationDate )
        setOrders(newOrdersAray)
    }

    const handleAddMultipleOrders = (orderArrayToAdd) => {
        console.log("handleAddMultipleOrders called")
        const newOrdersAray = filterUnique([...orders, ...orderArrayToAdd], item => item.creationDate )
        setOrders(newOrdersAray)
    }

    const filterUnique = (data, key) => {
        return [
            ...new Map(
                data.map(item => [key(item), item])
            ).values()
        ]
    }

    return (
        <OrderContext.Provider value={{
            orders,
            handleAddOrder,
            handleAddMultipleOrders,
        }}>
            {children}
        </OrderContext.Provider>
    )
}

export default OrderContext