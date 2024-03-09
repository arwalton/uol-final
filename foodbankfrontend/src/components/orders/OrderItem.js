import { useState } from "react"
import { updateOrderItem } from "./OrderActions"
import { toastOnError } from "../../utils/Utils"

const OrderItem = ({orderItem}) => {
    const [amountRemainingToDisplay, setAmountRemainingToDisplay] = useState(Number(orderItem.amountRemaining))
    const [isUpdating, setIsUpdating] = useState(false)
    const [amountToSubtract, setAmountToSubtract] = useState(0)

    const handleUpdateAmountRemaining = () => {
        setIsUpdating(true)
        const newAmount = (amountToSubtract < amountRemainingToDisplay) ? amountRemainingToDisplay - amountToSubtract : 0
        updateOrderItem(orderItem.id, {...orderItem, amountRemaining: newAmount})
                .then(response => {
                    setIsUpdating(false)
                    setAmountRemainingToDisplay(newAmount)
                })
                .catch(error => {
                    toastOnError(error)
                })
    }

    return (
        <div>
            <p class="is-size-5">{orderItem.item.name + ': '}</p>
            <p>{amountRemainingToDisplay.toFixed(2) + ' ' + orderItem.unit} </p>
            <form onSubmit={(event) => {
                // Prevents form from default submission behavior
                event.preventDefault();
                handleUpdateAmountRemaining()
            }}>
                <div class="field">
                    <label class="label" for="amountToSubtract">How much to subtract?</label>
                    <input 
                        type="number"
                        id="amountToSubtract" 
                        name="amountToSubtract" 
                        value={amountToSubtract}
                        min="0"
                        step="0.05"
                        onChange={(e)=>setAmountToSubtract(e.target.value)} 
                    />
                </div>
                <button class="button" type="submit">Update amount remaining</button>
            </form>
        </div>
    )
}

export default OrderItem