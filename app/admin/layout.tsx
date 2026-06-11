import Link from 'next/link'
import { Dumbbell, LayoutDashboard, Package, ShoppingCart, LogOut } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { logout } from '@/actions/auth'
import { cn } from '@/lib/utils'

const adminNav = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/planes', label: 'Planes', icon: Package },
  { href: '/admin/ventas', label: 'Ventas', icon: ShoppingCart },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Sidebar */}
      <aside className="w-60 border-r border-white/5 bg-[#0D0D0D] flex-col fixed inset-y-0 left-0 z-40 hidden lg:flex">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
              <Dumbbell className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white">
              Ago<span className="text-blue-500">Training</span>
            </span>
          </Link>
          <p className="text-xs text-gray-600 mt-1 ml-9">Panel Admin</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {adminNav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <form action={logout}>
            <Button type="submit" variant="ghost" size="sm" className="w-full justify-start gap-2 text-gray-400 hover:text-white">
              <LogOut className="h-4 w-4" />
              Salir
            </Button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-60">
        {/* Mobile header */}
        <header className="lg:hidden border-b border-white/5 bg-[#0D0D0D] px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
              <Dumbbell className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white">Admin</span>
          </Link>
          <div className="flex gap-2">
            {adminNav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                title={label}
                className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'text-gray-400 hover:text-white h-8 w-8')}
              >
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </header>

        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
