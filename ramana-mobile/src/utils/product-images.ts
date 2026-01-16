import type { ImageSourcePropType } from "react-native"
import type { StoreProductDTO } from "../dtos/product"

export const PRODUCT_IMAGES: Record<string, ImageSourcePropType> = {
  pain: require("../../assets/images/pain.jpg"),
  lait: require("../../assets/images/milk.jpg"),
  milk: require("../../assets/images/milk.jpg"),
  riz: require("../../assets/images/riz.jpg"),
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
