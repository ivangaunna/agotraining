import Link from 'next/link'
import { Dumbbell } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Dumbbell className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">
            Ago<span className="text-blue-500">Training</span>
          </span>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
