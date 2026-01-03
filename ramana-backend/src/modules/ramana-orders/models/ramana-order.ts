import { model } from "@medusajs/framework/utils"

export const RamanaOrder = model.define("ramana_order", {
  id: model.id().primaryKey(),

  status: model.text(),

  customer: model.json(),
  items: model.json(),

  payment_method: model.text(),

  subtotal: model.number(),
  total: model.number(),

})
