import { createRamanaOrderWorkflow } from "../../../../modules/ramana-orders/workflows/create-ramana-order"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const workflow = createRamanaOrderWorkflow(req.scope)

    const result = await workflow.run({
      input: req.body,
    })

    return res.status(201).json({
      order: result.result,
    })
  } catch (error: any) {
    //  Erreurs métier
    return res.status(400).json({
      message: error?.message ?? "Erreur lors de la création de la commande",
    })
  }
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const ramanaOrdersService = req.scope.resolve<any>("ramana_orders")

  const limit = Number(req.query.limit ?? 20)
  const offset = Number(req.query.offset ?? 0)

  const [orders, count] = await ramanaOrdersService.listAndCountRamanaOrders(
    {},
    {
      skip: offset,
      take: limit,
      order: { created_at: "DESC" },
    }
  )

  return res.status(200).json({
    orders,
    count,
    limit,
    offset,
  })
}