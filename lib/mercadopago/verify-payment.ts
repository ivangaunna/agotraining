import { Payment } from 'mercadopago'
import { getMercadoPagoClient } from './client'

export async function getPaymentById(paymentId: string) {
  const client = getMercadoPagoClient()
  const payment = new Payment(client)
  return payment.get({ id: paymentId })
}

export function mapMPStatusToPurchaseStatus(
  mpStatus: string
): 'approved' | 'rejected' | 'pending' | null {
  switch (mpStatus) {
    case 'approved':
      return 'approved'
    case 'rejected':
    case 'cancelled':
      return 'rejected'
    case 'pending':
    case 'in_process':
    case 'in_mediation':
      return 'pending'
    default:
      return null
  }
}
