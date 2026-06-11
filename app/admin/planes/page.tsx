import Link from 'next/link'
import { Plus, Pencil, FileText } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatCurrency } from '@/lib/utils'
import { TogglePlanButton } from '@/components/admin/toggle-plan-button'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Admin — Planes' }

export default async function AdminPlanesPage() {
  const adminClient = createAdminClient()

  const { data: plans } = await adminClient
    .from('plans')
    .select('*, plan_files(id, file_name, is_current)')
    .order('display_order', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Planes</h1>
          <p className="text-gray-400 mt-1 text-sm">Gestioná tus planes de entrenamiento</p>
        </div>
        <Link href="/admin/planes/nuevo" className={cn(buttonVariants(), 'bg-blue-600 hover:bg-blue-700 text-white gap-2')}>
          <Plus className="h-4 w-4" />
          Nuevo plan
        </Link>
      </div>

      {!plans || plans.length === 0 ? (
        <div className="bg-[#111111] border border-white/8 rounded-2xl p-12 text-center">
          <p className="text-gray-400 mb-4">No hay planes creados todavía.</p>
          <Link href="/admin/planes/nuevo" className={cn(buttonVariants(), 'bg-blue-600 hover:bg-blue-700 text-white')}>
            Crear primer plan
          </Link>
        </div>
      ) : (
        <div className="bg-[#111111] border border-white/8 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">Plan</th>
                  <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">Precio</th>
                  <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">PDF</th>
                  <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">Estado</th>
                  <th className="text-right px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {plans.map((plan) => {
                  const files = plan.plan_files as Array<{ id: string; file_name: string; is_current: boolean }>
                  const currentFile = files?.find((f) => f.is_current)
                  return (
                    <tr key={plan.id} className="hover:bg-white/2 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-white">{plan.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{plan.slug}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {formatCurrency(plan.price, plan.currency)}
                      </td>
                      <td className="px-6 py-4">
                        {currentFile ? (
                          <div className="flex items-center gap-1.5 text-xs text-green-400">
                            <FileText className="h-3.5 w-3.5" />
                            <span className="truncate max-w-32">{currentFile.file_name}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-red-400">Sin PDF</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <TogglePlanButton id={plan.id} isActive={plan.is_active} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/planes/${plan.id}`}
                          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-gray-400 hover:text-white')}
                        >
                          <Pencil className="h-3.5 w-3.5 mr-1.5" />
                          Editar
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
