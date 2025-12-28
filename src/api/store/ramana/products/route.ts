import type { MedusaResponse, MedusaStoreRequest } from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  getVariantAvailability,
} from "@medusajs/framework/utils"

export async function GET(req: MedusaStoreRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  /**
   * 1. Récupérer les produits (SANS le stock)
   */
  const { data: products } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "title",
      "description",
      "status",
      "categories.name",

      // Variants
      "variants.id",
      "variants.title",

      // Pricing (Medusa v2)
      "variants.price_set.prices.amount",
      "variants.price_set.prices.currency_code",
    ],
    filters: {
      status: "published",
    },
  })

  /**
   * 2. Récupérer le Sales Channel depuis la publishable key
   */
  const salesChannelId =
    req.publishable_key_context?.sales_channel_ids?.[0]

  if (!salesChannelId) {
    return res.status(400).json({
      error: "Missing sales channel (publishable API key required)",
    })
  }

  /**
   * 3. Récupérer toutes les variantes
   */
  const variantIds = products.flatMap((p) =>
    p.variants.map((v) => v.id)
  )

  /**
   * 4. Demander à Medusa la disponibilité VENDABLE
   */
  const availability = await getVariantAvailability(query, {
    variant_ids: variantIds,
    sales_channel_id: salesChannelId,
  })

  /**
   * 5. Formater la réponse pour l'app Ramana
   */
  const formatted = products.map((product) => ({
    id: product.id,
    title: product.title,
    description: product.description,
    category: product.categories?.[0]?.name ?? "Produits",
    variants: product.variants.map((variant) => {
      const price = variant.price_set?.prices.find(
        (p) => p?.currency_code === "XOF"
      )

      const availableQty =
        availability?.[variant.id]?.availability ?? 0

      return {
        id: variant.id,
        title: variant.title,
        price: price?.amount ?? 0,
        currency: "XOF",
        available_quantity: availableQty,
        in_stock: availableQty > 0,
      }
    }),
  }))

  res.json({ products: formatted })
}
