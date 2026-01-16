export type StoreOrderLineInputDTO = {
  variant_id: string
  quantity: number
}

export type StoreOrderItemsDTO = {
  lines: StoreOrderLineInputDTO[]
}

export type StoreOrderListDTO = {
  id: string
  status: "pending" | "completed" | "cancelled"
  customer: {
    name: string
    phone: string
    address: string
  }
  items: StoreOrderItemsDTO
  payment_method: string
  subtotal: number
  total: number
  created_at: string
}

export type StoreOrderDetailsLineDTO = {
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
  items: StoreOrderDetailsLineDTO[]
  payment_method: string
  subtotal: number
  total: number
  actions?: {
    can_confirm: boolean
    can_cancel: boolean
  }
}
