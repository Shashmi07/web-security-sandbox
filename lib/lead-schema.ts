import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email(),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s().-]{7,20}$/, "Invalid phone number")
    .refine((phone) => phone.replace(/\D/g, "").length >= 7, {
      message: "Invalid phone number",
    }),
  status: z.enum(["new", "contacted", "qualified", "converted", "lost"]),
});

export const leadUpdateSchema = leadSchema.partial();
