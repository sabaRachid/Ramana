import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export type CalculatePricesInput = {
  variants: any 
  items: {
    lines: {
      variant_id: string
      quantity: number
    }[]
  }
}

export const calculateOrderPricesStep = createStep(
  "calculate-ramana-order-prices",
  async (input: CalculatePricesInput) => {
    let subtotal = 0

    const variants = input.variants.data

    for (const line of input.items.lines) {
      const variant = variants.find(
        (v: any) => v.id === line.variant_id
      )

      if (!variant) {
        throw new Error(
          `Variant introuvable pour le pricing: ${line.variant_id}`
        )
      }

      const price = variant.price_set?.prices?.find(
        (p: any) => p.currency_code === "XOF"
      )

      if (!price) {
        throw new Error(
          `Prix XOF manquant pour le variant ${line.variant_id}`
        )
      }

      subtotal += price.amount * line.quantity
    }

    return new StepResponse({
      subtotal,
      total: subtotal,
    })
  }
)
