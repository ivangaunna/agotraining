import { redirect } from 'next/navigation'
import { FileText, ShoppingBag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DownloadButton } from '@/components/dashboard/download-button'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate, goalLabel } from '@/lib/utils'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Mi Dashboard',
}

const statusConfig = {
  approved: { label: 'Aprobado', className: 'bg-green-500/10 text-green-400 border-green-500/20' },
  pending: { label: 'Pendiente', className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  rejected: { label: 'Rechazado', className: 'bg-red-500/10 text-red-400 border-red-500/20' },
  cancelled: { label: 'Cancelado', className: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
  refunded: { label: 'Reembolsado', className: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
} as const

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: purchases } = await supabase
    .from('purchases')
    .select('*, plans(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const approvedPurchases = purchases?.filter((p) => p.status === 'approved') ?? []
  const allPurchases = purchases ?? []

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Mis planes</h1>
        <p className="text-gray-400 mt-1 text-sm">
          {approvedPurchases.length === 0
            ? 'Todavía no tenés planes. ¡Empezá hoy!'
            : `Tenés ${approvedPurchases.length} plan${approvedPurchases.length !== 1 ? 'es' : ''} disponible${approvedPurchases.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Planes comprados */}
      {approvedPurchases.length === 0 ? (
        <div className="bg-[#111111] border border-white/8 rounded-2xl p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20">
              <ShoppingBag className="h-7 w-7 text-blue-400" />
            </div>
          </div>
          <h3 className="text-white font-semibold mb-2">No tenés planes todavía</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
            Elegí un plan de entrenamiento y comenzá tu transformación hoy mismo.
          </p>
          <a href="/#planes" className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
            Ver planes disponibles
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {approvedPurchases.map((purchase) => {
            const plan = purchase.plans as NonNullable<typeof purchase.plans>
            return (
              <div
                key={purchase.id}
                className="bg-[#111111] border border-white/8 rounded-2xl p-6 hover:border-blue-500/30 transition-colors"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/20 flex-shrink-0">
                    <FileText className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-blue-400 font-medium">{goalLabel(plan.goal)}</p>
                    <h3 className="text-white font-semibold text-sm mt-0.5 truncate">{plan.title}</h3>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-4">
                  Comprado el {formatDate(purchase.created_at)}
                </p>

                <DownloadButton purchaseId={purchase.id} />
              </div>
            )
          })}
        </div>
      )}

      {/* Historial de compras */}
      {allPurchases.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Historial de compras</h2>
          <div className="bg-[#111111] border border-white/8 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">Plan</th>
                    <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">Monto</th>
                    <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">Estado</th>
                    <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {allPurchases.map((purchase) => {
                    const plan = purchase.plans as NonNullable<typeof purchase.plans>
                    const status = statusConfig[purchase.status as keyof typeof statusConfig]
                    return (
                      <tr key={purchase.id} className="hover:bg-white/2 transition-colors">
                        <td className="px-6 py-4 text-sm text-white">{plan?.title ?? 'Plan eliminado'}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {formatCurrency(purchase.amount, purchase.currency)}
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={`text-xs border ${status?.className ?? ''}`}>
                            {status?.label ?? purchase.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{formatDate(purchase.created_at)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
