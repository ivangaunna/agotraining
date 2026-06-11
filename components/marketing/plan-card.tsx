'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { initiateCheckout } from '@/actions/purchases'
import { formatCurrency } from '@/lib/utils'
import type { Plan } from '@/types/database'
import { toast } from 'sonner'

interface PlanCardProps {
  plan: Plan
  featured?: boolean
}

export function PlanCard({ plan, featured = false }: PlanCardProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handlePurchase() {
    setLoading(true)
    try {
      const result = await initiateCheckout(plan.id)

      if ('error' in result && result.error) {
        toast.error(result.error)
        return
      }

      if ('checkoutUrl' in result && result.checkoutUrl) {
        window.location.href = result.checkoutUrl
      }
    } catch {
      toast.error('Error inesperado. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`relative flex flex-col rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 ${
        featured
          ? 'border-blue-500/50 bg-gradient-to-b from-blue-950/20 to-[#111111] shadow-xl shadow-blue-500/10'
          : 'border-white/8 bg-[#111111] hover:border-white/20'
      }`}
    >
      {featured && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <Badge className="bg-blue-600 text-white border-0 text-xs px-3 py-1">
            Más popular
          </Badge>
        </div>
      )}

      <div className="mb-6">
        <p className="text-sm text-blue-400 font-medium mb-1">{goalBadgeLabel(plan.goal)}</p>
        <h3 className="text-xl font-bold text-white mb-3">{plan.title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{plan.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-end gap-1">
          <span className="text-4xl font-bold text-white">{formatCurrency(plan.price, plan.currency)}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Pago único · Acceso de por vida</p>
      </div>

      <ul className="space-y-2.5 mb-8 flex-1">
        {plan.benefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2.5">
            <Check className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-300">{benefit}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={handlePurchase}
        disabled={loading}
        className={`w-full h-11 font-semibold ${
          featured
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
        }`}
        variant={featured ? 'default' : 'outline'}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Procesando...
          </>
        ) : (
          'Comprar plan'
        )}
      </Button>
    </div>
  )
}

function goalBadgeLabel(goal: Plan['goal']): string {
  const labels: Record<Plan['goal'], string> = {
    fat_loss: 'Pérdida de Grasa',
    hypertrophy: 'Masa Muscular',
    body_recomposition: 'Recomposición',
  }
  return labels[goal]
}
