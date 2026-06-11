import { z } from 'zod'

export const planSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(100),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  description: z.string().min(20, 'La descripción debe tener al menos 20 caracteres').max(1000),
  benefits: z.array(z.string().min(1)).min(1, 'Agregá al menos un beneficio').max(10),
  price: z.number().positive('El precio debe ser mayor a 0'),
  currency: z.string().default('ARS'),
  goal: z.enum(['fat_loss', 'hypertrophy', 'body_recomposition']),
  is_active: z.boolean().default(true),
  display_order: z.number().int().min(0).default(0),
})

export type PlanInput = z.infer<typeof planSchema>
