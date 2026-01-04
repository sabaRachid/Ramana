import { z } from "zod"
import { createRamanaOrderWorkflow } from "../../../../modules/ramana-orders/workflows/create-ramana-order"
import { CreateRamanaOrderSchema } from "../../../../validators/store/create-ramana-order"
import { ListRamanaOrdersSchema } from "../../../../validators/store/list-ramana-orders"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    // VALIDATION RUNTIME
    const parsed = CreateRamanaOrderSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid request payload",
        errors: z.treeifyError(parsed.error),
      })
    }

    const payload = parsed.data

    const workflow = createRamanaOrderWorkflow(req.scope)

    const result = await workflow.run({
      input: {
        ...payload,
        status: "pending",
      },
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

  // VALIDATION RUNTIME DES QUERY PARAMS
  const parsed = ListRamanaOrdersSchema.safeParse(req.query)

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid query parameters",
      errors: z.treeifyError(parsed.error),
    })
  }

  const { limit, offset } = parsed.data

  const ramanaOrdersService = req.scope.resolve<any>("ramana_orders")

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