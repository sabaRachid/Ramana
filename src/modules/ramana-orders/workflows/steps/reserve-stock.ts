import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export const reserveStockStep = createStep(
  "reserve-ramana-stock",
  async (
    input: {
      variants: { data: any[] }
      items: { lines: { variant_id: string; quantity: number }[] }
    }
  ) => {
    const updates: {
      inventory_item_id: string
      location_id: string
      adjustment: number
    }[] = []

    for (const line of input.items.lines) {
      const variant = input.variants.data.find(
        (v) => v.id === line.variant_id
      )
      if (!variant) {
        throw new Error(`Variant introuvable: ${line.variant_id}`)
      }

      const inventory = variant.inventory?.[0]
      const level = inventory?.location_levels?.[0]
      if (!inventory || !level) {
        throw new Error(`Aucun stock pour ${line.variant_id}`)
      }

      const available =
        level.stocked_quantity - level.reserved_quantity

      if (available < line.quantity) {
        throw new Error(`Stock insuffisant pour ${line.variant_id}`)
      }

      updates.push({
        inventory_item_id: inventory.id,
        location_id: level.location_id,
        adjustment: -line.quantity,
      })
    }

    return new StepResponse(updates)
  }
)
