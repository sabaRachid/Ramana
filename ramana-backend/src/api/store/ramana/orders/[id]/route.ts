import { z } from "zod"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { StoreOrderDTO } from "../../../../../dtos/store"
import { GetRamanaOrderParamsSchema } from "../../../../../validators/store/get-ramana-order"

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
  
  const order: StoreOrderDTO = {
    id: entity.id,
    status: entity.status,
    customer: entity.customer,
    items: entity.items,
    payment_method: entity.payment_method,
    subtotal: entity.subtotal,
    total: entity.total,
    created_at: entity.created_at.toISOString(),
  }


  return res.status(200).json({ order })
}
