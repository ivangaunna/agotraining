'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, Dumbbell, User, ShieldCheck } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const navLinks = [
  { href: '/#planes', label: 'Planes' },
  { href: '/#como-funciona', label: 'Cómo funciona' },
  { href: '/#sobre-mi', label: 'Sobre mí' },
  { href: '/#faq', label: 'FAQ' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    async function loadSession() {
      const { data } = await supabase.auth.getUser()
      setIsLoggedIn(!!data.user)
      setIsAdmin(data.user?.app_metadata?.role === 'admin')
    }

    loadSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
      setIsAdmin(session?.user?.app_metadata?.role === 'admin')
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Dumbbell className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Ago<span className="text-blue-500">Training</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAdmin && (
              <Link
                href="/admin/planes"
                className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-yellow-400 hover:text-yellow-300 gap-1.5')}
              >
                <ShieldCheck className="h-4 w-4" />
                Admin
              </Link>
            )}
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-gray-400 hover:text-white gap-2')}
              >
                <User className="h-4 w-4" />
                Mi cuenta
              </Link>
            ) : (
              <Link href="/login" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-gray-400 hover:text-white')}>
                Ingresar
              </Link>
            )}
            <Link href="/#planes" className={cn(buttonVariants({ size: 'sm' }), 'bg-blue-600 hover:bg-blue-700 text-white')}>
              Ver planes
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="md:hidden text-gray-400 hover:text-white" />
              }
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#111111] border-white/10 w-72">
              <div className="flex items-center gap-2 mb-8">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                  <Dumbbell className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">
                  Ago<span className="text-blue-500">Training</span>
                </span>
              </div>
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-base text-gray-300 hover:text-white transition-colors py-1"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
                  {isAdmin && (
                    <Link
                      href="/admin/planes"
                      onClick={() => setOpen(false)}
                      className={cn(buttonVariants({ variant: 'ghost' }), 'justify-start text-yellow-400 gap-2')}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Admin
                    </Link>
                  )}
                  {isLoggedIn ? (
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className={cn(buttonVariants({ variant: 'ghost' }), 'justify-start text-gray-300 gap-2')}
                    >
                      <User className="h-4 w-4" />
                      Mi cuenta
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className={cn(buttonVariants({ variant: 'ghost' }), 'justify-start text-gray-300')}
                    >
                      Ingresar
                    </Link>
                  )}
                  <Link
                    href="/#planes"
                    onClick={() => setOpen(false)}
                    className={cn(buttonVariants(), 'bg-blue-600 hover:bg-blue-700 text-white')}
                  >
                    Ver planes
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
