import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export const createRamanaOrderStep = createStep(
  "create-ramana-order-step",
  async (input: any, { container }) => {
    const ramanaOrdersService = container.resolve("ramana_orders")
    const created = await ramanaOrdersService.createRamanaOrders(input)
    return new StepResponse(created)
  }
)
