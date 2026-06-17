import Image from 'next/image'
import { CheckCircle2 } from 'lucide-react'
import { FadeIn } from '@/components/ui/fade-in'

const certifications = [
  'Instructor de Musculación y Especialista en Hipertrofia',
  'Especialista en Nutrición Deportiva Avanzada',
  'Especialista en Entrenamiento Online',
  'Certificado RCP — American Heart Association',
]

export function AboutSection() {
  return (
    <section id="sobre-mi" className="py-24 bg-[#0A0A0A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <FadeIn className="flex justify-center order-2 lg:order-1">
            <div className="relative w-80 h-[420px] lg:w-96 lg:h-[560px] rounded-2xl overflow-hidden border border-white/10">
              <Image
                src="/images/principal1.png"
                alt="Alexis Obregón — AgoTraining"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          </FadeIn>

          {/* Content */}
          <FadeIn delay={150} className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-6">
              Sobre mí
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-6">
              Hola, soy Alexis —{' '}
              <span className="text-blue-500">tu entrenador</span>
            </h2>

            <p className="text-gray-400 leading-relaxed mb-4">
              Soy Alexis Obregón, entrenador personal especializado en musculación, hipertrofia, recomposición corporal y pérdida de grasa. Trabajo de forma presencial y online, ayudando a personas de distintos niveles a mejorar su físico, rendimiento y hábitos.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              Soy instructor de musculación, estudiante de profesorado de Educación Física y atleta de fisicoculturismo natural con experiencia en competencias. Mi objetivo con AGOTRAINING es brindar un servicio profesional, cercano y basado en la evidencia, adaptando cada planificación a las necesidades de cada persona.
            </p>

            <div className="space-y-3">
              {certifications.map((cert) => (
                <div key={cert} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{cert}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
