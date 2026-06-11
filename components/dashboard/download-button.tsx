'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSignedDownloadUrl } from '@/actions/purchases'
import { toast } from 'sonner'

interface DownloadButtonProps {
  purchaseId: string
  fileName?: string
}

export function DownloadButton({ purchaseId, fileName }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    setLoading(true)
    try {
      const result = await getSignedDownloadUrl(purchaseId)

      if ('error' in result && result.error) {
        toast.error(result.error)
        return
      }

      if ('url' in result && result.url) {
        const link = document.createElement('a')
        link.href = result.url
        link.download = result.fileName ?? fileName ?? 'plan-agotraining.pdf'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success('Descarga iniciada')
      }
    } catch {
      toast.error('Error al generar el enlace. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
      size="sm"
      className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Generando...
        </>
      ) : (
        <>
          <Download className="h-3.5 w-3.5" />
          Descargar PDF
        </>
      )}
    </Button>
  )
}
