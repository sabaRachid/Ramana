import { apiFetch } from "./client"
import { StoreOrderDTO } from "../dtos/order"

export function getOrder(id: string) {
  return apiFetch<{ order: StoreOrderDTO }>(
    `/store/ramana/orders/${id}`
  )
}

export function listOrders(limit = 20, offset = 0) {
  return apiFetch<{
    orders: StoreOrderDTO[]
    count: number
    limit: number
    offset: number
  }>(`/store/ramana/orders?limit=${limit}&offset=${offset}`)
}

export function createOrder(payload: {
  customer: StoreOrderDTO["customer"]
  items: StoreOrderDTO["items"]
  payment_method: string
}) {
  return apiFetch<{ order: StoreOrderDTO }>(
    `/store/ramana/orders`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  )
}
