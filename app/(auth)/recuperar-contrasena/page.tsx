'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, Mail } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { resetPassword } from '@/actions/auth'
import { cn } from '@/lib/utils'

export default function RecuperarContrasenaPage() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await resetPassword(formData)

    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }
    setPending(false)
  }

  if (success) {
    return (
      <div className="bg-[#111111] border border-white/8 rounded-2xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/30">
            <Mail className="h-7 w-7 text-blue-400" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Email enviado</h2>
        <p className="text-gray-400 text-sm mb-6">
          Revisá tu bandeja de entrada. Si el email está registrado, recibirás un enlace para restablecer tu contraseña.
        </p>
        <Link
          href="/login"
          className={cn(buttonVariants({ variant: 'outline' }), 'border-white/15 text-gray-300 hover:text-white')}
        >
          Volver al login
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white">Recuperar contraseña</h1>
        <p className="text-gray-400 mt-2 text-sm">
          Ingresá tu email y te enviamos un enlace para restablecer tu contraseña.
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
            <Label htmlFor="email" className="text-gray-300 text-sm">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              required
              autoComplete="email"
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
                Enviando...
              </>
            ) : (
              'Enviar enlace'
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
            ← Volver al login
          </Link>
        </p>
      </div>
    </div>
  )
}
