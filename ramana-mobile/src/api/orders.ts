import { apiFetch } from "./client"
import type {
  StoreOrderDetailsDTO,
  StoreOrderItemsDTO,
  StoreOrderListDTO,
} from "../dtos/order"

export function getOrder(id: string) {
  return apiFetch<{ order: StoreOrderDetailsDTO }>(
    `/store/ramana/orders/${id}`
  )
}

export function listOrders(limit = 20, offset = 0) {
  return apiFetch<{
    orders: StoreOrderListDTO[]
    count: number
    limit: number
    offset: number
  }>(`/store/ramana/orders?limit=${limit}&offset=${offset}`)
}

export function createOrder(payload: {
  customer: StoreOrderListDTO["customer"]
  items: StoreOrderItemsDTO
  payment_method: "cash"
}) {
  return apiFetch<{ order: StoreOrderDetailsDTO }>(
    `/store/ramana/orders`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  )
}
