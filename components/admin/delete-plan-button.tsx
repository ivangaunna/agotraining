'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deletePlan } from '@/actions/plans'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function DeletePlanButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('¿Seguro que querés eliminar este plan? Esta acción no se puede deshacer.')) return
    setLoading(true)
    const result = await deletePlan(id)
    if (result && 'error' in result) {
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success('Plan eliminado')
      router.refresh()
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
    </Button>
  )
}
