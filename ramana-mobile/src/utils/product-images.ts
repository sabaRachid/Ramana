import type { StoreProductDTO } from "../dtos/product"

export const PRODUCT_IMAGES: Record<string, string> = {
  pain: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=1200&auto=format&fit=crop",
  lait: "https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=1200&auto=format&fit=crop",
  riz: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=1200&auto=format&fit=crop",
}

export function getProductImageByTitle(title: string) {
  const lower = title.toLowerCase()
  const match = Object.keys(PRODUCT_IMAGES).find((key) =>
    lower.includes(key)
  )
  return match ? PRODUCT_IMAGES[match] : undefined
}

export function getProductImage(product: StoreProductDTO) {
  return getProductImageByTitle(product.title)
}
