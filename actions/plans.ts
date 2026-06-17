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
  const { error } = await adminClient.from('plans').delete().eq('id', id)

  if (error) return { error: 'Error al eliminar el plan.' }

  revalidatePath('/admin/planes')
  revalidatePath('/')
  return { success: true }
}

export async function uploadPlanFile(planId: string, formData: FormData) {
  await verifyAdmin()

  const file = formData.get('file') as File
  if (!file || file.type !== 'application/pdf') {
    return { error: 'Solo se permiten archivos PDF.' }
  }

  if (file.size > 50 * 1024 * 1024) {
    return { error: 'El archivo no puede superar 50MB.' }
  }

  const adminClient = createAdminClient()
  const bucket = process.env.SUPABASE_STORAGE_BUCKET!
  const storagePath = `plans/${planId}/${Date.now()}_${file.name}`

  const { error: uploadError } = await adminClient.storage
    .from(bucket)
    .upload(storagePath, file, { contentType: 'application/pdf', upsert: false })

  if (uploadError) return { error: 'Error al subir el archivo.' }

  // Marcar archivos anteriores como no actuales
  await adminClient
    .from('plan_files')
    .update({ is_current: false })
    .eq('plan_id', planId)

  // Crear registro del nuevo archivo
  const { error: dbError } = await adminClient.from('plan_files').insert({
    plan_id: planId,
    storage_path: storagePath,
    file_name: file.name,
    file_size: file.size,
    is_current: true,
  })

  if (dbError) return { error: 'Error al registrar el archivo.' }

  revalidatePath(`/admin/planes/${planId}`)
  return { success: true }
}
