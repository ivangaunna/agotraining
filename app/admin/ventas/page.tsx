import { Badge } from '@/components/ui/badge'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Metadata } from 'next'
import type { PurchaseStatus } from '@/types/database'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Admin — Ventas' }

const statusConfig: Record<PurchaseStatus, { label: string; className: string }> = {
  approved: { label: 'Aprobado', className: 'bg-green-500/10 text-green-400 border-green-500/20' },
  pending: { label: 'Pendiente', className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  rejected: { label: 'Rechazado', className: 'bg-red-500/10 text-red-400 border-red-500/20' },
  cancelled: { label: 'Cancelado', className: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
  refunded: { label: 'Reembolsado', className: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
}

interface PurchaseRow {
  id: string
  amount: number
  currency: string
  status: PurchaseStatus
  created_at: string
  profiles: { full_name: string | null } | null
  plans: { title: string } | null
}

interface Props {
  searchParams: Promise<{ status?: string; q?: string }>
}

export default async function VentasPage({ searchParams }: Props) {
  const { status, q } = await searchParams
  const adminClient = createAdminClient()

  const validStatuses: PurchaseStatus[] = ['pending', 'approved', 'rejected', 'cancelled', 'refunded']
  const filterStatus = status && validStatuses.includes(status as PurchaseStatus)
    ? (status as PurchaseStatus)
    : null

  let baseQuery = adminClient
    .from('purchases')
    .select('id, amount, currency, status, created_at, plans(title), profiles:user_id(full_name)')
    .order('created_at', { ascending: false })

  if (filterStatus) {
    baseQuery = baseQuery.eq('status', filterStatus) as typeof baseQuery
  }

  const { data } = await baseQuery as unknown as { data: PurchaseRow[] | null }
  const purchases = data ?? []

  const filtered = q
    ? purchases.filter((p) => {
        const name = p.profiles?.full_name?.toLowerCase() ?? ''
        const plan = p.plans?.title?.toLowerCase() ?? ''
        return name.includes(q.toLowerCase()) || plan.includes(q.toLowerCase())
      })
    : purchases

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Ventas</h1>
          <p className="text-gray-400 mt-1 text-sm">
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form className="flex gap-2 flex-1">
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar por cliente o plan..."
            className="flex-1 bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          {filterStatus && <input type="hidden" name="status" value={filterStatus} />}
          <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors">
            Buscar
          </button>
        </form>

        <div className="flex gap-2 flex-wrap">
          {[
            { value: 'all', label: 'Todos' },
            { value: 'approved', label: 'Aprobados' },
            { value: 'pending', label: 'Pendientes' },
            { value: 'rejected', label: 'Rechazados' },
          ].map((filter) => (
            <a
              key={filter.value}
              href={`/admin/ventas?status=${filter.value}${q ? `&q=${q}` : ''}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                (status ?? 'all') === filter.value
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-white/10 text-gray-400 hover:text-white hover:border-white/20'
              }`}
            >
              {filter.label}
            </a>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-white/8 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">Cliente</th>
                <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">Plan</th>
                <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">Monto</th>
                <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">Estado</th>
                <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                    No se encontraron ventas.
                  </td>
                </tr>
              ) : (
                filtered.map((purchase) => {
                  const statusInfo = statusConfig[purchase.status]
                  return (
                    <tr key={purchase.id} className="hover:bg-white/2 transition-colors">
                      <td className="px-6 py-4 text-sm text-white">
                        {purchase.profiles?.full_name ?? 'Sin nombre'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {purchase.plans?.title ?? '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {formatCurrency(purchase.amount, purchase.currency)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`text-xs border ${statusInfo.className}`}>
                          {statusInfo.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {formatDate(purchase.created_at)}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
