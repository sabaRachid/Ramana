import { z } from "zod"

/**
 * Validation runtime des params de route
 */
export const GetRamanaOrderParamsSchema = z.object({
  id: z.string().min(1, "Order id is required"),
})
