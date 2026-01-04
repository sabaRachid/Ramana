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
    // 🔒 Erreurs métier propres
    return res.status(400).json({
      message: error?.message ?? "Erreur lors de la création de la commande",
    })
  }
}
