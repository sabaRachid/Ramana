import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { EntityManager } from "@medusajs/framework/mikro-orm/core"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

interface OrderRequest {
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

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { customer, items, payment_method } = req.body as OrderRequest

  /* ------------------------------------------------------------------
   * 1️⃣ Validation des données
   * ------------------------------------------------------------------ */
  if (
    !customer?.name ||
    !customer?.phone ||
    !customer?.address ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({
      error: "Données de commande invalides",
    })
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const inventory = req.scope.resolve("inventory")
  const db = req.scope.resolve("db") as EntityManager

  /* ------------------------------------------------------------------
   * 2️⃣ Récupération des variantes
   * ------------------------------------------------------------------ */
  const variantIds = items.map((i) => i.variant_id)

  const { data: variants } = await query.graph({
    entity: "product_variant",
    fields: [
      "id",
      "title",
      "product.title",
      "price_set.prices.amount",
      "inventory_items.inventory_item_id",
    ],
    filters: {
      id: variantIds,
    },
  })

  if (variants.length !== items.length) {
    return res.status(400).json({
      error: "Un ou plusieurs produits sont invalides",
    })
  }

  /* ------------------------------------------------------------------
   * 3️⃣ Vérification du stock
   * ------------------------------------------------------------------ */
  const inventoryContext = new Map<
    string,
    { inventoryItemId: string; locationId: string }
  >()

  for (const item of items) {
    const variant = variants.find((v) => v.id === item.variant_id)
    const inventoryItemId =
      variant?.inventory_items?.[0]?.inventory_item_id

    if (!inventoryItemId) {
      return res.status(400).json({
        error: `Aucun inventaire pour ${variant?.title}`,
      })
    }

    const levels = await inventory.listInventoryLevels({
      inventory_item_id: inventoryItemId,
    })

    const level = levels[0]

    if (!level) {
      return res.status(400).json({
        error: `Aucun stock trouvé pour ${variant?.title}`,
      })
    }

    const available =
      (level.stocked_quantity ?? 0) -
      (level.reserved_quantity ?? 0)

    if (item.quantity > available) {
      return res.status(400).json({
        error: `Stock insuffisant pour ${variant?.title}`,
        available,
      })
    }

    inventoryContext.set(item.variant_id, {
      inventoryItemId,
      locationId: level.location_id,
    })
  }

  /* ------------------------------------------------------------------
   * 4️⃣ Construction des items de commande
   * ------------------------------------------------------------------ */
  let subtotal = 0

  const orderItems = items.map((item) => {
    const variant = variants.find((v) => v.id === item.variant_id)!
    const price = variant.price_set?.prices?.[0]?.amount ?? 0

    const lineSubtotal = price * item.quantity
    subtotal += lineSubtotal

    return {
      variant_id: variant.id,
      product_title: variant.product?.title,
      variant_title: variant.title,
      unit_price: price,
      quantity: item.quantity,
      subtotal: lineSubtotal,
    }
  })

  /* ------------------------------------------------------------------
   * 5️⃣ Décrémentation du stock
   * ------------------------------------------------------------------ */
  for (const item of items) {
    const ctx = inventoryContext.get(item.variant_id)!

    await inventory.adjustInventory([{
      inventoryItemId: ctx.inventoryItemId,
      locationId: ctx.locationId,
      adjustment: -item.quantity,
    }])
  }

  /* ------------------------------------------------------------------
   * 6️⃣ Création de la commande Ramana
   * ------------------------------------------------------------------ */
  const order = {
    id: `ramana_${Date.now()}`,
    status: "pending",
    customer,
    items: orderItems,
    payment_method: payment_method ?? "cash",
    subtotal,
    total: subtotal,
    created_at: new Date().toISOString(),
  }

  /* ------------------------------------------------------------------
   * 7️⃣ Sauvegarde en base PostgreSQL
   * ------------------------------------------------------------------ */
  await db.getConnection().execute(
    `
    INSERT INTO ramana_orders (
      id,
      status,
      customer,
      items,
      payment_method,
      subtotal,
      total,
      created_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
    [
      order.id,
      order.status,
      order.customer,
      order.items,
      order.payment_method,
      order.subtotal,
      order.total,
      order.created_at,
    ]
  )

  /* ------------------------------------------------------------------
   * 8️⃣ Réponse
   * ------------------------------------------------------------------ */
  return res.status(201).json({ order })
}
