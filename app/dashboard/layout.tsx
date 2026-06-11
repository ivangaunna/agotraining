import Link from 'next/link'
import { Dumbbell, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logout } from '@/actions/auth'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Top nav */}
      <header className="border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
                <Dumbbell className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-base font-bold text-white">
                Ago<span className="text-blue-500">Training</span>
              </span>
            </Link>

            <div className="flex items-center gap-4">
              {user?.user_metadata?.full_name && (
                <span className="text-sm text-gray-400 hidden sm:block">
                  {user.user_metadata.full_name as string}
                </span>
              )}
              <form action={logout}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Salir</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
