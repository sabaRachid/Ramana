import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

type ValidateRamanaOrderInput = {
  customer?: {
    name?: unknown
    phone?: unknown
    address?: unknown
  }
  items?: {
    lines?: unknown
  }
  payment_method?: unknown
}

export const validateRamanaOrderStep = createStep(
  "validate-ramana-order",
  async (input: ValidateRamanaOrderInput) => {
    // 1️⃣ Customer
    if (
      !input.customer ||
      typeof input.customer.name !== "string" ||
      typeof input.customer.phone !== "string" ||
      typeof input.customer.address !== "string"
    ) {
      throw new Error("Customer invalide")
    }

    // 2️⃣ Items
    if (
      !input.items ||
      !Array.isArray(input.items.lines) ||
      input.items.lines.length === 0
    ) {
      throw new Error("Aucune ligne de commande valide")
    }

    for (const line of input.items.lines) {
      if (
        !line ||
        typeof line.variant_id !== "string" ||
        typeof line.quantity !== "number" ||
        line.quantity <= 0
      ) {
        throw new Error("Ligne de commande invalide")
      }
    }

    // 3️⃣ Payment method
    if (input.payment_method !== "cash") {
      throw new Error("Moyen de paiement non supporté")
    }

    return new StepResponse(input)
  }
)
