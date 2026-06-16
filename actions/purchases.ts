'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createPaymentPreference } from '@/lib/mercadopago/create-preference'
import { redirect } from 'next/navigation'

export async function initiateCheckout(planId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Obtener el plan desde DB (precio real, nunca del cliente)
  const { data: plan, error: planError } = await supabase
    .from('plans')
    .select('*')
    .eq('id', planId)
    .eq('is_active', true)
    .single()

  if (planError || !plan) {
    return { error: 'Plan no encontrado.' }
  }

  // Verificar que no tenga ya una compra aprobada del mismo plan
  const { data: existingPurchase } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('plan_id', planId)
    .eq('status', 'approved')
    .single()

  if (existingPurchase) {
    return { error: 'Ya adquiriste este plan. Accedé desde tu dashboard.' }
  }

  // Crear registro de compra pendiente
  const { data: purchase, error: purchaseError } = await supabase
    .from('purchases')
    .insert({
      user_id: user.id,
      plan_id: plan.id,
      amount: plan.price,
      currency: plan.currency,
      status: 'pending',
    })
    .select('id')
    .single()

  if (purchaseError || !purchase) {
    return { error: 'Error al iniciar el proceso de compra.' }
  }

  // Crear preferencia en Mercado Pago
  try {
    const preference = await createPaymentPreference({
      plan,
      purchaseId: purchase.id,
      userEmail: user.email!,
    })

    // Guardar el preference_id
    await supabase
      .from('purchases')
      .update({ mercadopago_preference_id: preference.id })
      .eq('id', purchase.id)

    return { checkoutUrl: preference.init_point }
  } catch (err) {
    process.stdout.write('MP error: ' + String(err) + '\n')
    // Si falla MP, eliminar la compra pendiente
    await supabase.from('purchases').delete().eq('id', purchase.id)
    return { error: 'Error al conectar con Mercado Pago. Intentá de nuevo.' }
  }
}

export async function getSignedDownloadUrl(purchaseId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'No autorizado.' }
  }

  // Verificar que la compra pertenece al usuario y está aprobada
  const { data: purchase, error: purchaseError } = await supabase
    .from('purchases')
    .select('plan_id, status, user_id')
    .eq('id', purchaseId)
    .single()

  if (purchaseError || !purchase) {
    return { error: 'Compra no encontrada.' }
  }

  if (purchase.user_id !== user.id) {
    return { error: 'No autorizado.' }
  }

  if (purchase.status !== 'approved') {
    return { error: 'Esta compra no está aprobada.' }
  }

  // Obtener el archivo actual del plan
  const { data: planFile, error: fileError } = await supabase
    .from('plan_files')
    .select('storage_path, file_name')
    .eq('plan_id', purchase.plan_id)
    .eq('is_current', true)
    .single()

  if (fileError || !planFile) {
    return { error: 'Archivo no disponible todavía.' }
  }

  // Crear URL firmada con TTL de 5 minutos (necesita admin para bypasear RLS de storage)
  const adminClient = createAdminClient()
  const { data: signedUrl, error: urlError } = await adminClient.storage
    .from(process.env.SUPABASE_STORAGE_BUCKET!)
    .createSignedUrl(planFile.storage_path, 300)

  if (urlError || !signedUrl) {
    return { error: 'Error al generar el enlace de descarga.' }
  }

  return { url: signedUrl.signedUrl, fileName: planFile.file_name }
}
