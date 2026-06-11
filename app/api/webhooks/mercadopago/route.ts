import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getPaymentById, mapMPStatusToPurchaseStatus } from '@/lib/mercadopago/verify-payment'
import { sendPurchaseConfirmationEmail } from '@/lib/resend/templates/purchase-confirmation'
import type { MercadoPagoWebhookPayload } from '@/types'

export async function POST(request: NextRequest) {
  const adminClient = createAdminClient()

  let payload: MercadoPagoWebhookPayload
  try {
    payload = await request.json() as MercadoPagoWebhookPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Loguear el webhook inmediatamente (antes de procesar)
  await adminClient.from('payment_logs').insert({
    event_type: payload.type ?? 'unknown',
    mp_payment_id: payload.data?.id ?? null,
    payload: payload as unknown as import('@/types/database').Json,
    ip_address: request.headers.get('x-forwarded-for') ?? null,
  })

  // Solo procesar notificaciones de pago
  if (payload.type !== 'payment') {
    return NextResponse.json({ received: true })
  }

  const mpPaymentId = payload.data?.id
  if (!mpPaymentId) {
    return NextResponse.json({ error: 'Missing payment id' }, { status: 400 })
  }

  try {
    // Consultar a MP API para obtener el estado real (nunca confiar en el webhook)
    const payment = await getPaymentById(mpPaymentId)

    const externalReference = payment.external_reference
    if (!externalReference) {
      return NextResponse.json({ received: true })
    }

    // Obtener la compra por external_reference (= purchaseId)
    const { data: purchase, error: purchaseError } = await adminClient
      .from('purchases')
      .select('id, status, user_id, plan_id, amount, currency')
      .eq('id', externalReference)
      .single()

    if (purchaseError || !purchase) {
      return NextResponse.json({ received: true })
    }

    // Evitar procesar dos veces
    if (purchase.status === 'approved') {
      return NextResponse.json({ received: true })
    }

    const newStatus = mapMPStatusToPurchaseStatus(payment.status ?? '')
    if (!newStatus || newStatus === 'pending') {
      return NextResponse.json({ received: true })
    }

    // Actualizar estado de la compra
    await adminClient
      .from('purchases')
      .update({
        status: newStatus,
        mercadopago_payment_id: String(mpPaymentId),
        updated_at: new Date().toISOString(),
      })
      .eq('id', purchase.id)

    // Actualizar log con el purchase_id
    await adminClient
      .from('payment_logs')
      .update({ purchase_id: purchase.id })
      .eq('mp_payment_id', String(mpPaymentId))
      .is('purchase_id', null)

    // Enviar email de confirmación si el pago fue aprobado
    if (newStatus === 'approved') {
      // Obtener datos del usuario y el plan
      const [userResult, planResult] = await Promise.all([
        adminClient.auth.admin.getUserById(purchase.user_id),
        adminClient.from('plans').select('title').eq('id', purchase.plan_id).single(),
      ])

      const userEmail = userResult.data.user?.email
      const userName = userResult.data.user?.user_metadata?.full_name ?? 'Cliente'
      const planTitle = planResult.data?.title ?? 'Plan de entrenamiento'

      if (userEmail) {
        await sendPurchaseConfirmationEmail({
          to: userEmail,
          customerName: userName,
          planTitle,
          amount: purchase.amount,
          currency: purchase.currency,
          purchaseDate: new Intl.DateTimeFormat('es-AR', {
            day: '2-digit', month: 'long', year: 'numeric',
          }).format(new Date()),
        })

        await adminClient
          .from('purchases')
          .update({ email_sent: true })
          .eq('id', purchase.id)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ received: true })
  }
}
