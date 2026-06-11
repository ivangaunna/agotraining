import { notFound } from 'next/navigation'
import { PlanForm } from '@/components/admin/plan-form'
import { PdfUploadForm } from '@/components/admin/pdf-upload-form'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Admin — Editar Plan' }

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPlanPage({ params }: Props) {
  const { id } = await params
  const adminClient = createAdminClient()

  const { data: plan } = await adminClient
    .from('plans')
    .select('*')
    .eq('id', id)
    .single()

  if (!plan) notFound()

  const { data: planFiles } = await adminClient
    .from('plan_files')
    .select('*')
    .eq('plan_id', id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white">Editar plan</h1>
        <p className="text-gray-400 mt-1 text-sm">{plan.title}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        <div className="xl:col-span-3">
          <h2 className="text-base font-semibold text-white mb-4">Información del plan</h2>
          <PlanForm plan={plan} />
        </div>

        <div className="xl:col-span-2">
          <h2 className="text-base font-semibold text-white mb-4">Archivo PDF</h2>
          <PdfUploadForm planId={id} currentFiles={planFiles ?? []} />
        </div>
      </div>
    </div>
  )
}
