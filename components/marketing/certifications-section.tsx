import { Activity, Dumbbell, Heart, Moon, Laptop, Users, Award } from 'lucide-react'
import { FadeIn } from '@/components/ui/fade-in'

const certifications = [
  {
    title: 'Instructor de Musculación y Especialista en Hipertrofia',
    institution: 'ALIFID / GTI',
    category: 'Entrenamiento',
    icon: Dumbbell,
    color: 'blue',
  },
  {
    title: 'Nutrición Deportiva',
    institution: 'ALIFID / GTI',
    category: 'Nutrición',
    icon: Activity,
    color: 'green',
  },
  {
    title: 'Nutrición Deportiva Avanzada',
    institution: 'ALIFID / GTI',
    category: 'Nutrición',
    icon: Activity,
    color: 'green',
  },
  {
    title: 'Curso de Sueño y Rendimiento',
    institution: 'ALIFID / GTI',
    category: 'Bienestar',
    icon: Moon,
    color: 'purple',
  },
  {
    title: 'Especialista en Entrenamiento Online',
    institution: 'ALIFID / GTI',
    category: 'Entrenamiento',
    icon: Laptop,
    color: 'blue',
  },
  {
    title: 'Reanimación Cardiopulmonar (RCP)',
    institution: 'American Heart Association',
    category: 'Salud',
    icon: Heart,
    color: 'red',
  },
  {
    title: 'Bienestar y Fisiología del Ejercicio',
    institution: 'ICEN',
    category: 'Fisiología',
    icon: Award,
    color: 'yellow',
  },
  {
    title: 'Entrenar Adultos Mayores',
    institution: 'Gualda Training',
    category: 'Especialización',
    icon: Users,
    color: 'purple',
  },
]

const colorMap = {
  blue: {
    icon: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  green: {
    icon: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  purple: {
    icon: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  red: {
    icon: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    badge: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
  yellow: {
    icon: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  },
}

export function CertificationsSection() {
  return (
    <section id="certificaciones" className="py-24 bg-[#0A0A0A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-4">
            Formación
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Mis certificaciones
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Formación continua para brindarte el mejor servicio basado en evidencia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {certifications.map((cert, idx) => {
            const colors = colorMap[cert.color as keyof typeof colorMap]
            const Icon = cert.icon
            return (
              <FadeIn key={cert.title} delay={idx * 80}>
              <div
                className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-[#111111] p-5 hover:border-white/15 transition-colors"
              >
                <div className={`inline-flex w-10 h-10 items-center justify-center rounded-xl ${colors.bg} border ${colors.border}`}>
                  <Icon className={`h-5 w-5 ${colors.icon}`} />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold leading-snug mb-1">
                    {cert.title}
                  </p>
                  <p className="text-gray-500 text-xs">{cert.institution}</p>
                </div>
                <span className={`self-start text-xs px-2.5 py-1 rounded-full border font-medium ${colors.badge}`}>
                  {cert.category}
                </span>
              </div>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
