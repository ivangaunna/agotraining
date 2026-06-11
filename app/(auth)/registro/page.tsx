'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { register } from '@/actions/auth'
import { cn } from '@/lib/utils'

export default function RegisterPage() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await register(formData)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(true)
    }
    setPending(false)
  }

  if (success) {
    return (
      <div className="bg-[#111111] border border-white/8 rounded-2xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30">
            <CheckCircle2 className="h-7 w-7 text-green-400" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">¡Cuenta creada!</h2>
        <p className="text-gray-400 text-sm mb-6">
          Revisá tu email para confirmar tu cuenta y después podés iniciar sesión.
        </p>
        <Link href="/login" className={cn(buttonVariants(), 'bg-blue-600 hover:bg-blue-700 text-white')}>
          Ir al login
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white">Creá tu cuenta</h1>
        <p className="text-gray-400 mt-2 text-sm">Registrate para acceder a tus planes</p>
      </div>

      <div className="bg-[#111111] border border-white/8 rounded-2xl p-8">
        {error && (
          <Alert className="mb-6 border-red-500/30 bg-red-500/10">
            <AlertDescription className="text-red-400 text-sm">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-gray-300 text-sm">Nombre completo</Label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              placeholder="Juan Pérez"
              required
              autoComplete="name"
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500"
            />
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300 text-sm">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              required
              autoComplete="new-password"
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm_password" className="text-gray-300 text-sm">Confirmar contraseña</Label>
            <Input
              id="confirm_password"
              name="confirm_password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="new-password"
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
                Creando cuenta...
              </>
            ) : (
              'Crear cuenta'
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
            Ingresá aquí
          </Link>
        </p>
      </div>
    </div>
  )
}
