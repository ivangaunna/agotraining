'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginSchema, registerSchema, resetPasswordSchema } from '@/lib/validations/auth'

export async function login(formData: FormData) {
  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const parsed = loginSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    return { error: 'Email o contraseña incorrectos.' }
  }

  redirect('/dashboard')
}

export async function register(formData: FormData) {
  const raw = {
    full_name: formData.get('full_name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirm_password: formData.get('confirm_password') as string,
  }

  const parsed = registerSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.full_name },
    },
  })

  if (error) {
    console.error('[register] Supabase error: ' + error.message + ' status=' + error.status + ' code=' + (error as any).code)
    if (error.message.includes('already registered')) {
      return { error: 'Ya existe una cuenta con ese email.' }
    }
    return { error: 'Error al crear la cuenta. Intentá de nuevo.' }
  }

  return { success: 'Revisá tu email para confirmar tu cuenta.' }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function resetPassword(formData: FormData) {
  const raw = { email: formData.get('email') as string }
  const parsed = resetPasswordSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/actualizar-contrasena`,
  })

  if (error) {
    return { error: 'Error al enviar el email. Intentá de nuevo.' }
  }

  return { success: 'Te enviamos un email para restablecer tu contraseña.' }
}
