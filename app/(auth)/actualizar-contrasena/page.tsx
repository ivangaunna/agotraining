'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'
import type { Metadata } from 'next'

export default function ActualizarContrasenaPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setPending(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError('Error al actualizar la contraseña. El enlace puede haber expirado.')
      setPending(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white">Nueva contraseña</h1>
        <p className="text-gray-400 mt-2 text-sm">
          Ingresá tu nueva contraseña para acceder a tu cuenta.
        </p>
      </div>

      <div className="bg-[#111111] border border-white/8 rounded-2xl p-8">
        {error && (
          <Alert className="mb-6 border-red-500/30 bg-red-500/10">
            <AlertDescription className="text-red-400 text-sm">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300 text-sm">Nueva contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm" className="text-gray-300 text-sm">Confirmar contraseña</Label>
            <Input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repetí la contraseña"
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500"
            />
          </div>

          <Button
            type="submit"
            disabled={pending}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Actualizando...
              </>
            ) : (
              <>
                <KeyRound className="mr-2 h-4 w-4" />
                Actualizar contraseña
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
