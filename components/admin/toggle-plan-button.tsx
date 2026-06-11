'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { togglePlanActive } from '@/actions/plans'
import { toast } from 'sonner'

interface TogglePlanButtonProps {
  id: string
  isActive: boolean
}

export function TogglePlanButton({ id, isActive: initialActive }: TogglePlanButtonProps) {
  const [active, setActive] = useState(initialActive)
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    setLoading(true)
    const result = await togglePlanActive(id, !active)

    if ('error' in result && result.error) {
      toast.error(result.error)
    } else {
      setActive(!active)
      toast.success(active ? 'Plan desactivado' : 'Plan activado')
    }
    setLoading(false)
  }

  return (
    <button onClick={handleToggle} disabled={loading} className="cursor-pointer">
      <Badge
        className={`text-xs border select-none transition-opacity ${loading ? 'opacity-50' : ''} ${
          active
            ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20'
            : 'bg-gray-500/10 text-gray-400 border-gray-500/20 hover:bg-gray-500/20'
        }`}
      >
        {active ? 'Activo' : 'Inactivo'}
      </Badge>
    </button>
  )
}
