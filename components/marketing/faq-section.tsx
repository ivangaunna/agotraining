import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: '¿Necesito experiencia previa para seguir el plan?',
    answer:
      'No. Nuestros planes están diseñados para adaptarse a distintos niveles. Cada ejercicio viene explicado con indicaciones claras sobre ejecución, series y repeticiones, por lo que podés comenzar sin importar tu nivel actual.',
  },
  {
    question: '¿Puedo entrenar desde casa?',
    answer:
      'Depende del plan que elijas. Algunos están diseñados para gimnasio y otros pueden adaptarse al entrenamiento en casa con equipamiento mínimo. Revisá la descripción de cada plan para más detalles.',
  },
  {
    question: '¿Cómo recibo mi plan después de pagar?',
    answer:
      'Una vez confirmado el pago, tu plan queda disponible inmediatamente en tu dashboard. También te enviamos un email de confirmación con un botón para acceder directamente.',
  },
  {
    question: '¿Qué incluye cada plan?',
    answer:
      'Cada plan incluye un PDF descargable con el programa completo de entrenamiento: ejercicios, series, repeticiones, tiempos de descanso y progresión semanal. Todo listo para empezar desde el día uno.',
  },
  {
    question: '¿Cuánto tiempo dura el plan?',
    answer:
      'Los planes están diseñados para un ciclo de 8 semanas con progresión gradual. Podés repetirlos ajustando las cargas para continuar progresando.',
  },
  {
    question: '¿Puedo acceder al plan desde mi celular?',
    answer:
      'Sí. El dashboard de AgoTraining está optimizado para todos los dispositivos. Podés ver y descargar tu plan desde el celular, tablet o computadora en cualquier momento.',
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="py-24 bg-[#0D0D0D]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-4">
            Preguntas frecuentes
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            ¿Tenés dudas?
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion className="space-y-3">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={idx}
                className="border border-white/8 rounded-xl bg-[#111111] px-6 data-[panel-open]:border-blue-500/30"
              >
                <AccordionTrigger className="text-white hover:no-underline text-left py-5 text-sm font-medium hover:text-blue-400 transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 text-sm leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
