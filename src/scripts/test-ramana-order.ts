import { MedusaContainer } from "@medusajs/framework/types"

export default async function ({ container }: { container: MedusaContainer }) {
  const ramanaOrdersService = container.resolve("ramana_orders")

  const order = await ramanaOrdersService.createRamanaOrders({
    status: "pending",

    customer: {
      name: "John Doe",
      phone: "+22600000000",
      address: "Ouagadougou",
    },

    items: {
      lines: [
        {
          variant_id: "test-variant",
          quantity: 2,
          unit_price: 300,
        },
      ],
    },

    payment_method: "cash",
    subtotal: 600,
    total: 600,
  })

  console.log("ORDER CREATED:", order)
}
