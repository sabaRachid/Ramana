import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createInventoryLevelsWorkflow,
  createStockLocationsWorkflow,
  createSalesChannelsWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  createApiKeysWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function seedRamana({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("🌱 Seeding Ramana minimal data...")

  /**
   * 1. Créer une stock location minimale (OBLIGATOIRE)
   */
  const { result: stockLocations } =
    await createStockLocationsWorkflow(container).run({
      input: {
        locations: [
          {
            name: "Stock principal",
            address: {
              country_code: "BF", // Burkina Faso
              address_1: "01 Rue de la Paix",
              city: "Ouagadougou",
              postal_code: "01BP1234",
            },
          },
        ],
      },
    })

  const stockLocationId = stockLocations[0].id

 /**
   * 2. Récupérer ou créer la catégorie "Produits"
   */
  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    filters: {
      handle: "produits",
    },
    fields: ["id", "handle"],
  })

  let categoryId: string

  if (existingCategories.length) {
    categoryId = existingCategories[0].id
    logger.info("📦 Category 'Produits' already exists, reusing it.")
  } else {
    const { result: categories } =
      await createProductCategoriesWorkflow(container).run({
        input: {
          product_categories: [
            {
              name: "Produits",
              handle: "produits",
              is_active: true,
            },
          ],
        },
      })

    categoryId = categories[0].id
    logger.info("📦 Category 'Produits' created.")
  }

  /**
   * 3. Créer des produits simples (devise CFA)
   * FIX: Les options doivent être définies au niveau du produit
   */
  const existingProducts = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  })

  const productExists = (handle: string) =>
    existingProducts.data.some((p) => p.handle === handle)

  const productsToCreate: any[] = []

  if (!productExists("pain")) {
    productsToCreate.push({
      title: "Pain",
      description: "Pain frais du jour",
      status: ProductStatus.PUBLISHED,
      category_ids: [categoryId],
      options: [
        {
          title: "Format",
          values: ["Standard"],
        },
      ],
      variants: [
        {
          title: "Pain Standard",
          options: { Format: "Standard" },
          prices: [{ currency_code: "XOF", amount: 200 }],
          manage_inventory: true,
        },
      ],
    })
  }

  if (!productExists("lait")) {
    productsToCreate.push({
      title: "Lait",
      description: "Lait frais 1L",
      status: ProductStatus.PUBLISHED,
      category_ids: [categoryId],
      options: [
        {
          title: "Format",
          values: ["Standard"],
        },
      ],
      variants: [
        {
          title: "Lait 1L",
          options: { Format: "Standard" },
          prices: [
            {
              currency_code: "XOF",
              amount: 500,
            },
          ],
          manage_inventory: true,
        },
      ],
    })
  }

  if (!productExists("riz")) {
    productsToCreate.push({
      title: "Riz",
      description: "Riz local de qualité",
      status: ProductStatus.PUBLISHED,
      category_ids: [categoryId],
      options: [
        {
          title: "Poids",
          values: ["1kg", "5kg"],
        },
      ],
      variants: [
        {
          title: "Riz 1kg",
          options: { Poids: "1kg" },
          prices: [
            {
              currency_code: "XOF",
              amount: 800,
            },
          ],
          manage_inventory: true,
        },
        {
          title: "Riz 5kg",
          options: { Poids: "5kg" },
          prices: [
            {
              currency_code: "XOF",
              amount: 3500,
            },
          ],
          manage_inventory: true,
        },
      ],
    })
  }



  if (productsToCreate.length > 0) {
    await createProductsWorkflow(container).run({
      input: {
        products: productsToCreate,
      },
    })
    logger.info(`✅ ${productsToCreate.length} produits créés`)
  } else {
    logger.info("✅ Aucun produit à créer, tous existent déjà")
  }


  /**
   * 4. Initialiser le stock pour TOUTES les variantes
   */
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "sku"],
  })

  if (inventoryItems.length > 0) {
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: inventoryItems.map((item) => ({
          inventory_item_id: item.id,
          location_id: stockLocationId,
          stocked_quantity: 100,
        })),
      },
    })

    logger.info(`📦 Stock initialisé pour ${inventoryItems.length} variantes`)
  }

  /**
   * 5. Créer un Sales Channel Ramana
   */
  const { result: salesChannels } =
    await createSalesChannelsWorkflow(container).run({
      input: {
        salesChannelsData: [
          {
            name: "Ramana Mobile",
          },
        ],
      },
    })

  const salesChannelId = salesChannels[0].id

  /**
   * 6. Lier le stock au Sales Channel
   */
  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocationId,
      add: [salesChannelId],
    },
  })

  /**
   * 7. Créer une publishable API key
   */
  const { result: apiKeys } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        {
          title: "Ramana Mobile App",
          type: "publishable",
          created_by: "seed",
        },
      ],
    },
  })

  const publishableKeyId = apiKeys[0].id
  logger.info("🔑 Publishable API key created for Ramana Mobile App: " + apiKeys[0].token)

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableKeyId,
      add: [salesChannelId],
    },
  })

  logger.info("✅ Ramana seed completed successfully!")
}