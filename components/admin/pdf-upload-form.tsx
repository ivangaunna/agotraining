'use client'

import { useState, useRef } from 'react'
import { Upload, Loader2, CheckCircle2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getSignedUploadUrl, registerUploadedFile } from '@/actions/plans'
import { formatDate } from '@/lib/utils'
import type { PlanFile } from '@/types/database'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface PdfUploadFormProps {
  planId: string
  currentFiles: PlanFile[]
}

export function PdfUploadForm({ planId, currentFiles }: PdfUploadFormProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const currentFile = currentFiles.find((f) => f.is_current)

  async function handleUpload(file: File) {
    if (file.type !== 'application/pdf') {
      toast.error('Solo se permiten archivos PDF.')
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error('El archivo no puede superar 50MB.')
      return
    }

    setUploading(true)
    setProgress(0)

    // 1. Obtener URL firmada del servidor (no pasa el archivo por Vercel)
    const urlResult = await getSignedUploadUrl(planId, file.name)
    if ('error' in urlResult) {
      toast.error(urlResult.error)
      setUploading(false)
      return
    }

    // 2. Subir directo a Supabase Storage desde el browser
    try {
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100))
        }
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve()
          else reject(new Error(`HTTP ${xhr.status}`))
        }
        xhr.onerror = () => reject(new Error('Error de red'))
        xhr.open('PUT', urlResult.signedUrl)
        xhr.setRequestHeader('Content-Type', 'application/pdf')
        xhr.send(file)
      })
    } catch {
      toast.error('Error al subir el archivo. Intentá de nuevo.')
      setUploading(false)
      setProgress(0)
      return
    }

    // 3. Registrar el archivo en la base de datos
    const result = await registerUploadedFile(planId, urlResult.storagePath, file.name, file.size)
    if ('error' in result) {
      toast.error(result.error)
    } else {
      toast.success('PDF subido correctamente')
      router.refresh()
    }

    setUploading(false)
    setProgress(0)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  return (
    <div className="space-y-4">
      {currentFile && (
        <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-green-400 truncate">{currentFile.file_name}</p>
            <p className="text-xs text-gray-500 mt-0.5">Subido el {formatDate(currentFile.created_at)}</p>
          </div>
        </div>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          uploading
            ? 'border-blue-500/30 bg-blue-500/5 cursor-default'
            : dragOver
            ? 'border-blue-500 bg-blue-500/5 cursor-pointer'
            : 'border-white/10 hover:border-white/20 hover:bg-white/2 cursor-pointer'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
            <p className="text-sm text-gray-400">Subiendo PDF... {progress > 0 ? `${progress}%` : ''}</p>
            {progress > 0 && (
              <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-gray-500" />
            <p className="text-sm text-white font-medium">Arrastrá un PDF aquí</p>
            <p className="text-xs text-gray-500">o hacé click para seleccionar</p>
            <p className="text-xs text-gray-600 mt-1">Máximo 50MB</p>
          </div>
        )}
      </div>
    </div>
  )
}
