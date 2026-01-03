import { createRamanaOrderWorkflow } from "../../../../modules/ramana-orders/workflows/create-ramana-order"
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  // 1️⃣ Récupération du payload
  const body = req.body

  // 2️⃣ Exécution du workflow
  const workflow = createRamanaOrderWorkflow(req.scope)
  const result = await workflow.run({
    input: body,
  })

  // 3️⃣ Gestion des erreurs workflow
  if (result.errors?.length) {
    return res.status(400).json({
      errors: result.errors,
    })
  }

  // 4️⃣ Réponse Store
  return res.status(200).json({
    order: result.result,
  })
}
