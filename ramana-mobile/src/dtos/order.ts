export type StoreOrderLineDTO = {
  product_title: string
  variant_title?: string
  quantity: number
  unit_price: number
  total: number
}

export type StoreOrderDTO = {
  id: string
  status: "pending" | "completed" | "cancelled"

  customer: {
    name: string
    phone: string
    address: string
  }

  items: StoreOrderLineDTO[]

  payment_method: string
  subtotal: number
  total: number
  created_at: string

  actions?: {
    can_confirm: boolean
    can_cancel: boolean
  }
}
