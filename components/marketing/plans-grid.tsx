'use client'

import { useState } from 'react'
import { MessageCircle, Check } from 'lucide-react'
import { PlanCard } from './plan-card'
import { FadeIn } from '@/components/ui/fade-in'
import type { Plan } from '@/types/database'

const WHATSAPP_NUMBER = '5493482569105'
const WHATSAPP_ASESORIA = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola Alexis! Me interesa la Asesoría Personalizada de AGOTRAINING. ¿Podemos hablar?')}`

const asesoriaBenefits = [
  'Plan 100% personalizado según tu cuerpo y objetivos',
  'Seguimiento y ajustes continuos',
  'Contacto directo con el entrenador',
  'Adaptado a tu equipamiento disponible',
  'Soporte durante todo el proceso',
]

type FilterType = 'all' | 'gym' | 'home'

interface PlansGridProps {
  plans: Plan[]
}

export function PlansGrid({ plans }: PlansGridProps) {
  const [filter, setFilter] = useState<FilterType>('all')

  const filtered = plans.filter((p) => {
    if (filter === 'all') return true
    if (filter === 'gym') return p.location === 'gym' || p.location === 'both'
    if (filter === 'home') return p.location === 'home' || p.location === 'both'
    return true
  })

  return (
    <div>
      {/* Filtros */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/8">
          {([
            { value: 'all', label: 'Todos' },
            { value: 'gym', label: 'Gym' },
            { value: 'home', label: 'Casa' },
          ] as { value: FilterType; label: string }[]).map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === tab.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-400">No hay planes en esta categoría todavía.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {filtered.map((plan, idx) => (
          <FadeIn key={plan.id} delay={idx * 100}>
            <PlanCard plan={plan} featured={idx === 1 && filtered.length > 1} />
          </FadeIn>
        ))}

        {/* Card Asesoría Personalizada */}
        <FadeIn delay={filtered.length * 100}>
        <div className="relative flex flex-col rounded-2xl p-6 border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-[#111111] hover:-translate-y-1 transition-all duration-300">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span className="inline-block bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              Premium
            </span>
          </div>

          <div className="mb-6">
            <p className="text-sm text-emerald-400 font-medium mb-1">Para todos los objetivos</p>
            <h3 className="text-xl font-bold text-white mb-3">Asesoría personalizada AGOTRAINING</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Trabajá directamente con Alexis. Un plan diseñado exclusivamente para vos, con seguimiento continuo y ajustes según tu progreso.
            </p>
          </div>

          <div className="mb-6">
            <p className="text-3xl font-bold text-white">Precio a convenir</p>
            <p className="text-xs text-gray-500 mt-1">Consultá disponibilidad por WhatsApp</p>
          </div>

          <ul className="space-y-2.5 mb-8 flex-1">
            {asesoriaBenefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">{benefit}</span>
              </li>
            ))}
          </ul>

          <a
            href={WHATSAPP_ASESORIA}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-11 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Consultar por WhatsApp
          </a>
        </div>
        </FadeIn>
      </div>
    </div>
  )
}
