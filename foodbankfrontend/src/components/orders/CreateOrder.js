import { useEffect, useState } from "react";
import { addOrder, getSuppliers } from "./OrderActions";
import { Link } from "react-router-dom";
import { ORDER_STATUS } from "../../enums/orderStatus";
import { categoryChoices } from "../../constants/categories";
import { foodsByCategory } from "../../constants/foodsByCategory";
import { unitChoices } from "../../constants/unitChoices";
import { toastOnError } from "../../utils/Utils"
import { useNavigate } from 'react-router-dom'
import Header from "../header/Header";

const CreateOrder = () => {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const [duration, setDuration] = useState(2)
    const [orderItemFields, setOrderItemFields] = useState([{
        item: {
            name: '',
            category: ''
        },
        amountRemaining: 0,
        unit: ''
    }])
    const [suppliers, setSuppliers] = useState([])
    const [toOrganization, setToOrganization] = useState()

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
        switch (event.target.name) {
            case "category":
                console.log("category changed")
                data[index].item = {...data[index].item, "category": event.target.value}
                console.log("data[index].item after category select", data[index].item)
                break
            case "item":
                console.log("item changed")
                console.log("data[index].item before item select", data[index].item)
                data[index].item = {...data[index].item, "name": event.target.value}
                console.log("data[index].item after item select", data[index].item)
                break
            case "amountRemaining":
                console.log("amountRemaining changed")
                data[index].amountRemaining = event.target.value
                break
            case "unit":
                console.log("unit changed")
                data[index].unit = event.target.value
                break
            default:
                console.log("something messed up")
        }
        setOrderItemFields(data)
    }

    const removeOrderItemField = (indexToRemove) => {
        const data = orderItemFields.filter((field, index) => {
            return index !== indexToRemove
        })
        setOrderItemFields(data)
    }
    const mapCategoryChoices = Object.keys(categoryChoices).map((categoryChoice, index) => {
        return (<option value={categoryChoice}>{categoryChoice}</option>)
    })
    
    const mapUnitChoices = Object.keys(unitChoices).map((unit, index) => {
        return (<option value={unitChoices[unit]}>{unit}</option>)
    })

    const mapItemChoicesByCategory = (categoryIndex) => {
        console.log("category", orderItemFields[categoryIndex].item.category)
        const itemChoicesMap = foodsByCategory[orderItemFields[categoryIndex].item.category] ? (
            foodsByCategory[orderItemFields[categoryIndex].item.category].map((food, index) => {
                return (<option value={food}>{food}</option>)
            })
        ) : (
            <></>
        )
        return itemChoicesMap
    }

    const orderItemInputFields = orderItemFields.map((orderItem, index) => {
        return(
            <div class="box" key={index}>
                <div class="field">
                    <label class="label" for='category'>Choose a category</label>
                    <div class="select">
                        <select 
                            name="category"
                            id="category"
                            onChange={(e) => handleItemChange(index, e)}
                        >
                            {mapCategoryChoices}
                        </select>
                    </div>
                </div>
                {orderItemFields[index].item.category &&
                    <div class="field">
                        <label class="label" for='item'>Choose an item</label>
                        <div class="select">
                            <select
                                name="item"
                                id="item"
                                onChange={(e) => handleItemChange(index, e)}
                            >
                                {mapItemChoicesByCategory(index)}
                            </select>
                        </div>
                        
                    </div>
                }
                {orderItemFields[index].item.category &&
                    <>
                        <div class="field">
                            <label class="label" for='amountRemaining'>Choose an amount</label>
                            <div class="columns ml-1 mt-2 mb-3">
                                <input 
                                    class="input column is-one-fifth"
                                    name="amountRemaining"
                                    type="number"
                                    min={0}
                                    value={orderItem.amountRemaining}
                                    onChange={(e)=>handleItemChange(index, e)}
                                />
                            </div>
                        </div>
                        <div class="field">
                            <label class="label" for="unit">Units</label>
                            <div class="select">
                                <select
                                    name="unit"
                                    id="unit"
                                    onChange={(e) => handleItemChange(index, e)}
                                >
                                    {mapUnitChoices}
                                </select>
                            </div>
                        </div>
                    </>
                }
                <button class="button" type="button" onClick={() => removeOrderItemField(index)}>Remove item</button>
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
            item: {
                name: '',
                category: ''
            },
            amountRemaining: '',
            unit: ''
        }
        setOrderItemFields([...orderItemFields, newField])
    }

    const mapOrderItemCategories = () => {
        const data = [...orderItemFields]
            data.map((orderItem, index) => {
            return orderItem.item.category = categoryChoices[orderItem.item.category]
        })
        return data
    }

    const createNewOrder = () => {
        const orderData = {
            "expirationDate": calculateExpirationDate(),
            "status": ORDER_STATUS.OPEN,
            "orderItems": [...mapOrderItemCategories()],
            "toOrganization": toOrganization
        }

        addOrder(orderData)
        .then(response => {
            console.log(response.data)
            navigate("/order-created")
        })
        .catch(error => {
            toastOnError(error)
        })
    }

    return(
        <div>
            <Header />
            <div class="box">
                <h1 class="is-size-1">Create new Order</h1>
                <form onSubmit={(event) => {
                    // Prevents form from default submission behavior
                    event.preventDefault();
                    createNewOrder()
                }}>
                    <div class="field">
                        <label class="label" htmlFor="orderDuration">Set order duration: {duration} week(s)</label>
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
                    <button class="button is-primary" type="button" onClick={addOrderItemInputField}>Add another item</button>
                    <div class="field">
                        <label class="label" for="toOrganization">Choose where to send your order</label>
                        <div class="select">
                            <select
                                name="toOrganization"
                                id="toOrganization"
                                onChange={(e) => setToOrganization(e.target.value)}
                            >
                                <option value=''></option>
                                {supplierInputFields}
                            </select>
                        </div>
                    </div>
                    <button class="button is-link" type="submit">Submit your order</button>
                </form>
            </div>
        </div>
    )
}

export default CreateOrder