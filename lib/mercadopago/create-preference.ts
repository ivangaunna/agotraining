import { Preference } from 'mercadopago'
import { getMercadoPagoClient } from './client'
import type { Plan } from '@/types/database'

interface CreatePreferenceParams {
  plan: Plan
  purchaseId: string
  userEmail: string
}

export async function createPaymentPreference({
  plan,
  purchaseId,
  userEmail,
}: CreatePreferenceParams) {
  const client = getMercadoPagoClient()
  const preference = new Preference(client)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!

  const result = await preference.create({
    body: {
      items: [
        {
          id: plan.id,
          title: plan.title,
          description: plan.description,
          quantity: 1,
          unit_price: plan.price,
          currency_id: plan.currency,
        },
      ],
      payer: {
        email: userEmail,
      },
      back_urls: {
        success: `${appUrl}/dashboard?payment=success`,
        failure: `${appUrl}/planes?payment=failed`,
        pending: `${appUrl}/dashboard?payment=pending`,
      },
      auto_return: 'approved',
      notification_url: `${appUrl}/api/webhooks/mercadopago`,
      external_reference: purchaseId,
      statement_descriptor: 'AgoTraining',
    },
  })

  return result
}
