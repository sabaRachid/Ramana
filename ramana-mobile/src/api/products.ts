import { apiFetch } from "./client"
import type { StoreProductDTO } from "../dtos/product"

type ListProductsResponse = {
  products: StoreProductDTO[]
}

export async function listProducts(): Promise<StoreProductDTO[]> {
  const res = await apiFetch<ListProductsResponse>("/store/ramana/products")
  return res.products
}
