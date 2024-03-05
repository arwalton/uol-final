import axios from 'axios'
import { toastOnError } from '../../utils/Utils'

export const getOrders = () => {
    return axios.get("/api/orders/")
}

export const addOrder = (order) => {
    return axios.post("/api/orders/", order)
}

export const getSuppliers = () => {
    return axios.get("/api/suppliers")
}

export const updateOrder = (id, order) => {
    return axios.patch(`/api/orders/${id}/`, order)
}