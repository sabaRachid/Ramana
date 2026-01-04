export type StoreProductVariantDTO = {
  id: string
  title: string
  price: {
    amount: number
    currency_code: "XOF"
  }
  available_quantity: number
  in_stock: boolean
}

export type StoreProductDTO = {
  id: string
  title: string
  variants: StoreProductVariantDTO[]
}
