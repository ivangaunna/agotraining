import { ShoppingCart, CreditCard, Mail, Download } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: ShoppingCart,
    title: 'Elegí tu plan',
    description: 'Seleccioná el plan que mejor se adapte a tu objetivo: pérdida de grasa, masa muscular o recomposición corporal.',
  },
  {
    number: '02',
    icon: CreditCard,
    title: 'Completá el pago',
    description: 'Pagá de forma segura a través de Mercado Pago con tarjeta de crédito, débito o saldo en MP.',
  },
  {
    number: '03',
    icon: Mail,
    title: 'Recibí el acceso',
    description: 'Te enviamos un email de confirmación y tu plan queda disponible inmediatamente en tu dashboard.',
  },
  {
    number: '04',
    icon: Download,
    title: 'Descargá y empezá',
    description: 'Accedé a tu plan, descargá el PDF y comenzá tu transformación desde el primer día.',
  },
]

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-24 bg-[#0D0D0D]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-4">
            Proceso simple
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            ¿Cómo funciona?
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            En 4 pasos simples tenés acceso a tu plan de entrenamiento profesional.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-px bg-gradient-to-r from-white/10 to-transparent z-0" />
              )}

              <div className="relative z-10 bg-[#111111] border border-white/8 rounded-2xl p-6 hover:border-blue-500/30 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/20">
                    <step.icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <span className="text-3xl font-bold text-white/5">{step.number}</span>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
