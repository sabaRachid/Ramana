import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

/**
 * 1️⃣ Typage du body HTTP
 */
interface OrderRequestBody {
  customer: {
    name: string
    phone: string
    address: string
  }
  items: Array<{
    variant_id: string
    quantity: number
  }>
  payment_method?: string
}

/**
 * 2️⃣ Typage du service RamanaOrders
 * (correspond exactement à ce qu’on va implémenter dans le module)
 */
interface RamanaOrdersService {
  create(data: {
    id: string
    status: string
    customer: unknown
    items: unknown[]
    payment_method: string
    subtotal: number
    total: number
  }): Promise<any>
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  /**
   * 3️⃣ Cast explicite du body
   */
  const body = req.body as OrderRequestBody
  const { customer, items, payment_method } = body

  if (
    !customer?.name ||
    !customer?.phone ||
    !customer?.address ||
    !items?.length
  ) {
    return res.status(400).json({ error: "Invalid order data" })
  }

  /**
   * 4️⃣ Cast explicite du service
   */
  const ramanaOrdersService = req.scope.resolve(
    "ramanaOrders"
  ) as RamanaOrdersService

  let subtotal = 0

  const orderItems = items.map((item) => {
    const lineSubtotal = item.quantity * 200 // prix temporaire
    subtotal += lineSubtotal

    return {
      ...item,
      unit_price: 200,
      subtotal: lineSubtotal,
    }
  })

  /**
   * 5️⃣ Appel au module (pas de DB ici)
   */
  const order = await ramanaOrdersService.create({
    id: `ramana_${Date.now()}`,
    status: "pending",
    customer,
    items: orderItems,
    payment_method: payment_method ?? "cash",
    subtotal,
    total: subtotal,
  })

  return res.status(201).json({ order })
}
