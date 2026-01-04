import { z } from "zod"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { GetRamanaOrderParamsSchema } from "../../../../../validators/store/get-ramana-order"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { StoreOrderDetailsDTO } from "../../../../../dtos/store/order-details.dto"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  // VALIDATION RUNTIME DES PARAMS
  const parsed = GetRamanaOrderParamsSchema.safeParse(req.params)

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid route parameters",
      errors: z.treeifyError(parsed.error),
    })
  }
  
  const { id } = parsed.data

  const ramanaOrderService = req.scope.resolve<any>("ramana_orders")
  const entity = await ramanaOrderService.retrieveRamanaOrder(id)
  
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const variantIds = entity.items.lines.map(
    (line: any) => line.variant_id
  )

  const { data: variants } = await query.graph({
    entity: "variant",
    fields: [
      "id",
      "title",
      "product.title",
      "price_set.prices.amount",
      "price_set.prices.currency_code",
    ],
    filters: {
      id: variantIds,
    },
  })

  const items = entity.items.lines.map((line: any) => {
    const variant = variants.find(
      (v: any) => v.id === line.variant_id
    )

    if (!variant) {
      throw new Error(`Variant introuvable: ${line.variant_id}`)
    }

    const price = variant.price_set?.prices.find(
      (p: any) => p.currency_code === "XOF"
    )

  if (!price) {
      throw new Error(
        `Prix XOF manquant pour le variant ${variant.id}`
      )
    }

    return {
      product_title: variant.product?.title,
      variant_title: variant.title,
      quantity: line.quantity,
      unit_price: price.amount,
      total: price.amount * line.quantity,
    }
  })
  
  const order: StoreOrderDetailsDTO = {
    id: entity.id,
    status: entity.status,
    created_at: entity.created_at.toISOString(),

    customer: entity.customer,

    items,

    payment_method: entity.payment_method,
    subtotal: entity.subtotal,
    total: entity.total,

    actions: {
      can_confirm: entity.status === "pending",
      can_cancel: entity.status === "pending",
    },
  }


  return res.status(200).json({ order })
}
