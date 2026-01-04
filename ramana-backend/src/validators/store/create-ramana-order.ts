import { z } from "zod"

export const CreateRamanaOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(1, "customer.name is required"),
    phone: z.string().min(1, "customer.phone is required"),
    address: z.string().min(1, "customer.address is required"),
  }),

  items: z.object({
    lines: z
      .array(
        z.object({
          variant_id: z.string().min(1, "variant_id is required"),
          quantity: z.number().int().positive("quantity must be > 0"),
        })
      )
      .min(1, "at least one order line is required"),
  }),

  payment_method: z.literal("cash"),
})

export type CreateRamanaOrderInput = z.infer<
  typeof CreateRamanaOrderSchema
>
