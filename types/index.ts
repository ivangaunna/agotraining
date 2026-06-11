export type * from './database'
import type { Plan, PlanFile, Purchase } from './database'

export interface PlanWithFile extends Plan {
  plan_files: PlanFile[]
}

export interface PurchaseWithPlan extends Purchase {
  plans: Plan
}

export interface MercadoPagoWebhookPayload {
  action: string
  api_version: string
  data: {
    id: string
  }
  date_created: string
  id: number
  live_mode: boolean
  type: string
  user_id: string
}
