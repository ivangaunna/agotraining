import { DollarSign, ShoppingBag, Package } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatCurrency } from '@/lib/utils'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Admin — Overview' }

interface RecentPurchase {
  id: string
  amount: number
  currency: string
  status: string
  created_at: string
  profiles: { full_name: string | null } | null
  plans: { title: string } | null
}

export default async function AdminPage() {
  const adminClient = createAdminClient()

  const [
    { count: totalPlans },
    { data: purchaseStats },
    { data: recentPurchases },
  ] = await Promise.all([
    adminClient.from('plans').select('id', { count: 'exact', head: true }),
    adminClient
      .from('purchases')
      .select('amount, status, currency')
      .eq('status', 'approved'),
    adminClient
      .from('purchases')
      .select('id, amount, currency, status, created_at, plans(title), profiles:user_id(full_name)')
      .order('created_at', { ascending: false })
      .limit(5) as unknown as { data: RecentPurchase[] | null },
  ])

  const totalRevenue = purchaseStats?.reduce((sum, p) => sum + p.amount, 0) ?? 0
  const totalSales = purchaseStats?.length ?? 0

  const stats = [
    {
      label: 'Ingresos totales',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: 'text-green-400',
      bg: 'bg-green-500/10 border-green-500/20',
    },
    {
      label: 'Ventas aprobadas',
      value: totalSales.toString(),
      icon: ShoppingBag,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      label: 'Planes activos',
      value: (totalPlans ?? 0).toString(),
      icon: Package,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-gray-400 mt-1 text-sm">Resumen de tu plataforma</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#111111] border border-white/8 rounded-2xl p-6">
            <div className={`inline-flex p-2.5 rounded-xl border ${stat.bg} mb-4`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent sales */}
      {recentPurchases && recentPurchases.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Últimas ventas</h2>
          <div className="bg-[#111111] border border-white/8 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">Cliente</th>
                    <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">Plan</th>
                    <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentPurchases.map((p) => (
                    <tr key={p.id}>
                      <td className="px-6 py-4 text-sm text-white">
                        {p.profiles?.full_name ?? 'Sin nombre'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {p.plans?.title ?? '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {formatCurrency(p.amount, p.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
