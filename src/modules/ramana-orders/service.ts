import { MedusaService } from "@medusajs/framework/utils"
import { RamanaOrder } from "./models/ramana-order"

export class RamanaOrdersService extends MedusaService({
  RamanaOrder,
}) {}
