import { useEffect, useState } from "react";
import { addOrder, getSuppliers } from "./OrderActions";
import { Link } from "react-router-dom";
import { ORDER_STATUS } from "../../enums/orderStatus";
import { categoryChoices } from "../../constants/categories";
import { foodsByCategory } from "../../constants/foodsByCategory";
import { unitChoices } from "../../constants/unitChoices";
import { toastOnError } from "../../utils/Utils"

const CreateOrder = () => {
    const [error, setError] = useState("")
    const [duration, setDuration] = useState(2)
    const [orderItemFields, setOrderItemFields] = useState([{
        item: '',
        amountRemaining: 0,
        unit: ''
    }])
    const [categoryFields, setCategoryFields] = useState([])
    const [suppliers, setSuppliers] = useState([])
    const [toOrganization, setToOrganization] = useState({})

    useEffect(() => {
        let ignore = false
        getSuppliers()
        .then(response => {
            if(!ignore){
                console.log('response', response)
                setSuppliers(response.data)
            }
        })
        .catch(error => {
            toastOnError(error)
        })

        return () => {
            ignore = true
        }
    }, [])
    
    const calculateExpirationDate = () => {
        const date = new Date()
        const weekInMilliseconds = 7 * 24 * 60 * 60 * 1000
        date.setTime(date.getTime() + (weekInMilliseconds * duration))
        return date.toISOString()
    }

    const handleItemChange = (index, event) => {
        let data = [...orderItemFields]
        data[index][event.target.name] = event.target.value
        setOrderItemFields(data)
    }

    const handleCategoryChange = (index, event) => {
        let data = [...categoryFields]
        data[index] = event.target.value
        setCategoryFields(data)
    }

    const handleToOrganizationChange = (event) => {
        const orgName = event.target.value
        const org = suppliers.reduce((accumulator, current) => {
            if(current.name === orgName){
                return {...accumulator, ...current}
            }
            return {...accumulator}
        }, {})
        setToOrganization(org)
    }

    const removeOrderItemField = (indexToRemove) => {
        const data = orderItemFields.filter((field, index) => {
            return index !== indexToRemove
        })
        setOrderItemFields(data)
    }
    const mapCategoryChoices = categoryChoices.map((category, index) => {
        return (<option value={category}>{category}</option>)
    })
    
    const mapUnitChoices = Object.keys(unitChoices).map((unit, index) => {
        return (<option value={unitChoices[unit]}>{unit}</option>)
    })

    const mapItemChoicesByCategory = (categoryIndex) => {
        const itemChoicesMap = foodsByCategory[categoryFields[categoryIndex]] ? (
            foodsByCategory[categoryFields[categoryIndex]].map((food, index) => {
                return (<option value={food}>{food}</option>)
            })
        ) : (
            <></>
        )
        return itemChoicesMap
    }

    const orderItemInputFields = orderItemFields.map((orderItem, index) => {
        return(
            <div key={index}>
                <label for='category'>Choose a category</label>
                <select 
                    name="category"
                    id="category"
                    onChange={(e) => handleCategoryChange(index, e)}
                >
                    {mapCategoryChoices}
                </select>
                {categoryFields[index] &&
                    <div>
                        <label for='item'>Choose an item</label>
                        <select
                            name="item"
                            id="item"
                            onChange={(e) => handleItemChange(index, e)}
                        >
                            {mapItemChoicesByCategory(index)}
                        </select>
                    </div>
                }
                {(categoryFields[index] && orderItemFields[index].item) &&
                    <>
                        <div>
                            <label for='amountRemaining'>Choose an amount</label>
                            <input 
                                name="amountRemaining"
                                type="number"
                                value={orderItem.amountRemaining}
                                onChange={(e)=>handleItemChange(index, e)}
                            />
                        </div>
                        <div>
                            <label for="unit">Units</label>
                            <select
                                name="unit"
                                id="unit"
                                onChange={(e) => handleItemChange(index, e)}
                            >
                                {mapUnitChoices}
                            </select>
                        </div>
                    </>
                }
                <button type="button" onClick={() => removeOrderItemField(index)}>Remove item</button>
            </div>
        )
    })

    const supplierInputFields = suppliers.map((supplier, index) => {
        return (
            <option value={supplier.name}>{supplier.name}</option>
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
            "orderItems": [...orderItemFields],
            "toOrganization": toOrganization
        }

        console.log("createNewOrder", orderData)
        console.log("categories", categoryFields)
    }

    return(
        <div>
            <h1>Create new Order</h1>
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
                    <label for="toOrganization">Choose where to send your order</label>
                    <select
                        name="toOrganization"
                        id="toOrganization"
                        onChange={(e) => handleToOrganizationChange(e)}
                    >
                        <option value=''></option>
                        {supplierInputFields}
                    </select>
                </div>
                <button type="submit">Submit your order</button>
            </form>
        </div>
    )
}

export default CreateOrder