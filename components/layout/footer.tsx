import Link from 'next/link'
import { Dumbbell, MessageCircle } from 'lucide-react'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

export function Footer() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') ?? ''

  return (
    <footer className="border-t border-white/5 bg-[#0A0A0A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Dumbbell className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Ago<span className="text-blue-500">Training</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Planes de entrenamiento personalizados para cada objetivo. Pérdida de grasa, masa muscular y recomposición corporal.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Navegación</p>
            <ul className="space-y-2">
              {[
                { href: '/#planes', label: 'Planes' },
                { href: '/#como-funciona', label: 'Cómo funciona' },
                { href: '/#sobre-mi', label: 'Sobre mí' },
                { href: '/#faq', label: 'Preguntas frecuentes' },
                { href: '/login', label: 'Mi cuenta' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Contacto</p>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.instagram.com/agotraining.fit/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <InstagramIcon className="h-4 w-4" />
                  @agotraining.fit
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/5493482569105`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} AgoTraining. Todos los derechos reservados.
          </p>
          <a
            href="https://www.instagram.com/improve.code/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            Desarrollado por @improve.code
          </a>
        </div>
      </div>
    </footer>
  )
}
