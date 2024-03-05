
const OrderItem = ({orderItem}) => {

    return (
        <div>
            <p>{orderItem.item.name + ': ' + orderItem.amountRemaining + ' ' + orderItem.unit} </p>
        </div>
    )
}

export default OrderItem