export type StoreOrderItemDetailsDTO = {
  product_title: string
  variant_title?: string
  quantity: number
  unit_price: number
  total: number
}

export type StoreOrderDetailsDTO = {
  id: string
  status: "pending" | "completed" | "cancelled"
  created_at: string

  customer: {
    name: string
    phone: string
    address: string
  }

  items: StoreOrderItemDetailsDTO[]

  payment_method: string
  subtotal: number
  total: number

  actions: {
    can_confirm: boolean
    can_cancel: boolean
  }
}
