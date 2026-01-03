import { createWorkflow, WorkflowResponse, transform } from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

import { reserveStockStep } from "./steps/reserve-stock"
import { adjustRamanaStockStep } from "./steps/adjust-stock"
import { createRamanaOrderStep } from "./steps/create-ramana-order"

export const createRamanaOrderWorkflow = createWorkflow(
  "create-ramana-order",
  (input) => {
    /**
     * 1) Extraire les lignes de commande VIA transform
     *    (c’est le SEUL accès valide à l’input)
     */
    const lines = transform(input, (data: any) => data.items?.lines)

    /**
     * 2) Charger l’inventaire des variants (Query Graph)
     *    → on utilise lines comme référence
     */
    const variants = useQueryGraphStep({
      entity: "variant",
      fields: [
        "inventory.*",
        "inventory.location_levels.stocked_quantity",
        "inventory.location_levels.reserved_quantity",
        "inventory.location_levels.location_id",
      ],
      filters: {
        id: transform(lines, (ls: any[]) =>
          Array.isArray(ls) ? ls.map((l) => l.variant_id) : []
        ),
      },
    })

    /**
     * 3) Vérifier le stock et préparer les ajustements
     */
    const stockUpdates = reserveStockStep(
      transform({ variants, lines }, (d) => ({
        variants: d.variants,
        items: { lines: d.lines },
      }))
    )

    /**
     * 4) Appliquer les ajustements de stock
     */
    adjustRamanaStockStep(stockUpdates)

    /**
     * 5) Créer la commande (le step reçoit l’input complet)
     */
    const order = createRamanaOrderStep(
      transform(input, (data: any) => data)
    )

    return new WorkflowResponse(order)
  }
)
