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

export const getDistributors = () => {
    return axios.get("/api/distributors")
}

export const updateOrder = (id, order) => {
    return axios.patch(`/api/orders/${id}/`, order)
}

export const updateOrderItem = (id, orderItem) => {
    return axios.patch(`/api/orderItems/${id}/`, orderItem)
}