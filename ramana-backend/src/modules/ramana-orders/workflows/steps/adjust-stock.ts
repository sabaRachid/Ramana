import { adjustInventoryLevelsStep } from "@medusajs/medusa/core-flows"

export const adjustRamanaStockStep = (
  input: {
    inventory_item_id: string
    location_id: string
    adjustment: number
  }[]
) => {
  return adjustInventoryLevelsStep(input)
}
