import { PlanForm } from '@/components/admin/plan-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Nuevo Plan' }

export default function NuevoPlanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Nuevo plan</h1>
        <p className="text-gray-400 mt-1 text-sm">Creá un nuevo plan de entrenamiento</p>
      </div>
      <PlanForm />
    </div>
  )
}
