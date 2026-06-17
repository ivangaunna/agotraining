import { getActivePlans } from '@/actions/plans'
import { PlansGrid } from './plans-grid'
import { FadeIn } from '@/components/ui/fade-in'

export async function PlansSection() {
  const { data: plans, error } = await getActivePlans()

  return (
    <section id="planes" className="py-24 bg-[#0A0A0A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-4">
            Planes de entrenamiento
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Elegí tu plan
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Cada plan está diseñado específicamente para tu objetivo, ya sea que entrenes en el gym o en casa. Acceso inmediato, descarga en PDF, válido para siempre.
          </p>
        </FadeIn>

        {error && (
          <div className="text-center text-gray-400">
            <p>Error al cargar los planes. Intentá de nuevo.</p>
          </div>
        )}

        {!error && <PlansGrid plans={plans ?? []} />}
      </div>
    </section>
  )
}
