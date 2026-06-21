'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { planSchema } from '@/lib/validations/plan'
import type { PlanInput } from '@/lib/validations/plan'

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') redirect('/')
  return { supabase, user }
}

export async function getPlans() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('plans')
    .select('*, plan_files(id, file_name, is_current)')
    .order('display_order', { ascending: true })

  if (error) return { error: error.message }
  return { data }
}

export async function getActivePlans() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) return { error: error.message }
  return { data }
}

export async function createPlan(input: PlanInput) {
  await verifyAdmin()
  const parsed = planSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const adminClient = createAdminClient()
  const { data, error } = await adminClient
    .from('plans')
    .insert(parsed.data)
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') return { error: 'Ya existe un plan con ese slug.' }
    return { error: 'Error al crear el plan.' }
  }

  revalidatePath('/admin/planes')
  revalidatePath('/')
  return { data }
}

export async function updatePlan(id: string, input: Partial<PlanInput>) {
  await verifyAdmin()

  const adminClient = createAdminClient()
  const { error } = await adminClient
    .from('plans')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: 'Error al actualizar el plan.' }

  revalidatePath('/admin/planes')
  revalidatePath('/')
  return { success: true }
}

export async function togglePlanActive(id: string, isActive: boolean) {
  await verifyAdmin()

  const adminClient = createAdminClient()
  const { error } = await adminClient
    .from('plans')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: 'Error al actualizar el estado del plan.' }

  revalidatePath('/admin/planes')
  revalidatePath('/')
  return { success: true }
}

export async function deletePlan(id: string) {
  await verifyAdmin()

  const adminClient = createAdminClient()

  // Borrar archivos de storage y registros de plan_files
  const { data: files } = await adminClient
    .from('plan_files')
    .select('storage_path')
    .eq('plan_id', id)

  if (files && files.length > 0) {
    await adminClient.storage
      .from(process.env.SUPABASE_STORAGE_BUCKET!)
      .remove(files.map((f) => f.storage_path))
    await adminClient.from('plan_files').delete().eq('plan_id', id)
  }

  // Borrar compras asociadas
  await adminClient.from('purchases').delete().eq('plan_id', id)

  const { error } = await adminClient.from('plans').delete().eq('id', id)
  if (error) return { error: 'Error al eliminar el plan.' }

  revalidatePath('/admin/planes')
  revalidatePath('/')
  return { success: true }
}

export async function getSignedUploadUrl(planId: string, fileName: string) {
  await verifyAdmin()

  const adminClient = createAdminClient()
  const bucket = process.env.SUPABASE_STORAGE_BUCKET!
  const storagePath = `plans/${planId}/${Date.now()}_${fileName}`

  const { data, error } = await adminClient.storage
    .from(bucket)
    .createSignedUploadUrl(storagePath)

  if (error || !data) return { error: 'Error al generar URL de subida.' }

  return { signedUrl: data.signedUrl, storagePath }
}

export async function registerUploadedFile(
  planId: string,
  storagePath: string,
  fileName: string,
  fileSize: number,
) {
  await verifyAdmin()

  const adminClient = createAdminClient()

  await adminClient
    .from('plan_files')
    .update({ is_current: false })
    .eq('plan_id', planId)

  const { error: dbError } = await adminClient.from('plan_files').insert({
    plan_id: planId,
    storage_path: storagePath,
    file_name: fileName,
    file_size: fileSize,
    is_current: true,
  })

  if (dbError) return { error: 'Error al registrar el archivo.' }

  revalidatePath(`/admin/planes/${planId}`)
  return { success: true }
}
