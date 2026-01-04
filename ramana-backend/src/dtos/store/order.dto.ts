export type StoreOrderLineDTO = {
  variant_id: string
  quantity: number
}

export type StoreOrderDTO = {
  id: string
  status: "pending" | "completed" | "cancelled"
  customer: {
    name: string
    phone: string
    address: string
  }
  items: {
    lines: StoreOrderLineDTO[]
  }
  payment_method: string
  subtotal: number
  total: number
  created_at: string
}

export type StoreOrderListDTO = {
  orders: StoreOrderDTO[]
  count: number
  limit: number
  offset: number
}
