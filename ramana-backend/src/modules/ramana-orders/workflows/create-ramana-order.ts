import {
  createWorkflow,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

import { validateRamanaOrderStep } from "./steps/validate-ramana-order"
import { calculateOrderPricesStep } from "./steps/calculate-order-prices"
import { reserveStockStep } from "./steps/reserve-stock"
import { adjustRamanaStockStep } from "./steps/adjust-stock"
import { createRamanaOrderStep } from "./steps/create-ramana-order"

export const createRamanaOrderWorkflow = createWorkflow(
  "create-ramana-order",
  (input) => {
    const validated = validateRamanaOrderStep(input)
    const lines = transform(validated, (d: any) => d.items.lines)

    // 1️⃣ Pricing query
    const pricedVariants = useQueryGraphStep({
      entity: "variant",
      fields: [
        "id",
        "price_set.prices.amount",
        "price_set.prices.currency_code",
      ],
      filters: {
        id: transform(lines, (ls: any[]) =>
          ls.map((l) => l.variant_id)
        ),
      },
    }).config({ name: "query-variants-for-pricing" })

    // 2️⃣ Pricing serveur
    const pricing = calculateOrderPricesStep(
      transform(
        { pricedVariants, lines },
        (d) => ({
          variants: d.pricedVariants,
          items: { lines: d.lines },
        })
      )
    )

    // 3️⃣ Stock
    const stockVariants = useQueryGraphStep({
      entity: "variant",
      fields: [
        "inventory.*",
        "inventory.location_levels.stocked_quantity",
        "inventory.location_levels.reserved_quantity",
        "inventory.location_levels.location_id",
      ],
      filters: {
        id: transform(lines, (ls: any[]) =>
          ls.map((l) => l.variant_id)
        ),
      },
    }).config({ name: "query-variants-for-stock" })

    const stockUpdates = reserveStockStep(
      transform(
        { stockVariants, lines },
        (d) => ({
          variants: d.stockVariants,
          items: { lines: d.lines },
        })
      )
    )

    adjustRamanaStockStep(stockUpdates)

    // 4️⃣ Création commande avec PRIX SERVEUR
    const order = createRamanaOrderStep(
      transform({ input, pricing }, (d: any) => ({
        ...d.input,
        subtotal: d.pricing.subtotal,
        total: d.pricing.total,
      }))
    )

    return new WorkflowResponse(order)
  }
)
