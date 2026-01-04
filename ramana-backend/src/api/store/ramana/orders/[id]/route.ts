import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params

  const ramanaOrderService = req.scope.resolve<any>("ramana_orders")


  const order = await ramanaOrderService.retrieveRamanaOrder(id)

  return res.status(200).json({ order })
}
