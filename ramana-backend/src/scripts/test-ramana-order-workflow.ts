import { MedusaContainer } from "@medusajs/framework/types"
import { createRamanaOrderWorkflow } from "../modules/ramana-orders/workflows/create-ramana-order"

export default async function ({ container }: { container: MedusaContainer }) {
  const wf = createRamanaOrderWorkflow(container)

  const result = await wf.run({
    input: {
      status: "pending",
      customer: {
        name: "Workflow User",
        phone: "+22600000000",
        address: "Ouagadougou",
      },
      items: {
        lines: [
          { variant_id: "variant_01KDGKG1NPK368KG6FETYT17Y5", quantity: 1, unit_price: 500 },
        ],
      },
      payment_method: "cash",
      subtotal: 500,
      total: 500,
    },
  } as any)

  console.log("WORKFLOW RESULT:", result)
}
