'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { login } from '@/actions/auth'
import type { Metadata } from 'next'

export default function LoginPage() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await login(formData)

    if (result?.error) {
      setError(result.error)
      setPending(false)
    }
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white">Bienvenido de vuelta</h1>
        <p className="text-gray-400 mt-2 text-sm">Ingresá a tu cuenta para ver tus planes</p>
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-gray-300 text-sm">Contraseña</Label>
              <Link href="/recuperar-contrasena" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
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
                Ingresando...
              </>
            ) : (
              'Ingresar'
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿No tenés cuenta?{' '}
          <Link href="/registro" className="text-blue-400 hover:text-blue-300 transition-colors">
            Registrate gratis
          </Link>
        </p>
      </div>
    </div>
  )
}
