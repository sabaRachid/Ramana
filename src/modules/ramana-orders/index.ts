import { Module } from "@medusajs/framework/utils"
import { RamanaOrdersService } from "./service"

export default Module("ramana_orders", {
  service: RamanaOrdersService,
})
