import { useEffect, useState } from "react";
import { addOrder } from "./OrderActions";
import { Link } from "react-router-dom";
import { ORDER_STATUS } from "../../enums/orderStatus";

const CreateOrder = () => {
    const [error, setError] = useState("")
    const [duration, setDuration] = useState(2)
    const [orderItemFields, setOrderItemFields] = useState([{
        item: 'stuff',
        amountRemaining: 'some',
        unit: 'your mom'
    }])
    
    const calculateExpirationDate = () => {
        const date = new Date()
        const weekInMilliseconds = 7 * 24 * 60 * 60 * 1000
        date.setTime(date.getTime() + (weekInMilliseconds * duration))
        return date.toISOString()
    }

    const handleFormChange = (index, event) => {
        let data = [...orderItemFields]
        data[index][event.target.name] = event.target.value
        setOrderItemFields(data)
    }

    const removeOrderItemField = (indexToRemove) => {
        const data = orderItemFields.filter((field, index) => {
            return index !== indexToRemove
        })
        setOrderItemFields(data)
    }

    const orderItemInputFields = orderItemFields.map((orderItem, index) => {
        return(
            <div key={index}>
                <input 
                    name="item"
                    placeholder="item"
                    value={orderItem.item}
                    onChange={(e)=>handleFormChange(index, e)}
                />
                <input 
                    name="amountRemaining"
                    placeholder="amountRemaining"
                    value={orderItem.amountRemaining}
                    onChange={(e)=>handleFormChange(index, e)}
                />
                <input 
                    name="unit"
                    placeholder="unit"
                    value={orderItem.unit}
                    onChange={(e)=>handleFormChange(index, e)}
                />
                <button type="button" onClick={() => removeOrderItemField(index)}>Remove item</button>
            </div>
        )
    })

    const addOrderItemInputField = () => {
        const newField = {
            item: '',
            amountRemaining: '',
            unit: ''
        }
        setOrderItemFields([...orderItemFields, newField])
    }

    const createNewOrder = () => {
        const orderData = {
            "expirationDate": calculateExpirationDate(),
            "status": ORDER_STATUS.OPEN,
            "orderItems": [...orderItemFields]
        }

        console.log("createNewOrder", orderData)
    }

    return(
        <div>
            <h1>Sign up</h1>
            <form onSubmit={(event) => {
                // Prevents form from default submission behavior
                event.preventDefault();
                createNewOrder()
            }}>
                <div>
                    <label htmlFor="orderDuration">Set order duration: {duration} week(s)</label>
                    <input 
                        type="range"
                        id="orderDuration" 
                        name="orderDuration" 
                        value={duration} 
                        onChange={(e)=>setDuration(e.target.value)} 
                        min={1}
                        max={6}
                        step={1}
                    />
                </div>
                {orderItemInputFields}
                <button type="button" onClick={addOrderItemInputField}>Add another item</button>
                <div>
                    {/* <label htmlFor="username">Password</label>
                    <input type="password" id="password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                    <div>
                        {error &&
                        <small>
                            {error}
                        </small>
                        }
                    </div> */}
                </div>
                <button type="submit">Sign up</button>
            </form>
        </div>
    )
}

export default CreateOrder