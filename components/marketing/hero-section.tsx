import Link from 'next/link'
import Image from 'next/image'
import { MessageCircle, ChevronDown } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { FadeIn } from '@/components/ui/fade-in'
import { cn } from '@/lib/utils'

export function HeroSection() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') ?? ''

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <FadeIn className="text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Planes disponibles ahora
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white mb-6">
              Transformá tu físico con un plan{' '}
              <span className="text-blue-500">diseñado para tu objetivo</span>
            </h1>

            <p className="text-lg text-gray-400 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Planes de entrenamiento profesionales para pérdida de grasa, aumento de masa muscular y recomposición corporal. Sin excusas, solo resultados.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/#planes"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 text-base font-semibold'
                )}
              >
                Ver Planes
              </Link>
              <a
                href={`https://wa.me/${whatsapp}?text=Hola! Me interesa saber más sobre los planes de AgoTraining.`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'border-white/20 text-white hover:bg-white/5 h-12 px-8 text-base flex items-center gap-2'
                )}
              >
                <MessageCircle className="h-4 w-4" />
                Contactar por WhatsApp
              </a>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-white/5">
              {[
                { value: '100+', label: 'Clientes' },
                { value: '3', label: 'Planes disponibles' },
                { value: '100%', label: 'Digital' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Image */}
          <FadeIn delay={150} className="flex justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-sm h-72 sm:h-80 lg:w-96 lg:h-[500px] rounded-2xl overflow-hidden border border-white/10">
              <Image
                src="/images/principal2.png"
                alt="Alexis Obregón — AgoTraining"
                fill
                className="object-cover object-top"
                priority
              />
              <div className="absolute bottom-4 left-4 right-4 lg:bottom-6 lg:left-6 lg:right-6 bg-[#0A0A0A]/80 backdrop-blur rounded-xl p-3 lg:p-4 border border-white/10">
                <p className="text-white font-semibold text-sm">Entrenador Certificado</p>
                <p className="text-gray-400 text-xs mt-0.5">Especialista en transformación física</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-6 w-6 text-gray-600" />
      </div>
    </section>
  )
}
