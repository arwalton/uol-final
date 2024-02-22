import axios from 'axios'
import { toastOnError } from '../../utils/Utils'

export const getOrders = () => {
    return axios.get("/api/orders/")
}

export const addOrder = (order) => {
    axios.post("/api/orders/", order)
    .then(response => {
        return response.data
    })
    .catch(error => {
        toastOnError(error)
    })
}