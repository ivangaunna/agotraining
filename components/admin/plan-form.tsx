'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createPlan, updatePlan } from '@/actions/plans'
import { slugify, cn } from '@/lib/utils'
import type { Plan } from '@/types/database'
import { toast } from 'sonner'

interface PlanFormProps {
  plan?: Plan
}

export function PlanForm({ plan }: PlanFormProps) {
  const router = useRouter()
  const isEditing = Boolean(plan)

  const [title, setTitle] = useState(plan?.title ?? '')
  const [slug, setSlug] = useState(plan?.slug ?? '')
  const [description, setDescription] = useState(plan?.description ?? '')
  const [benefits, setBenefits] = useState<string[]>(plan?.benefits ?? [''])
  const [price, setPrice] = useState(plan?.price?.toString() ?? '')
  const [goal, setGoal] = useState<Plan['goal'] | ''>(plan?.goal ?? '')
  const [displayOrder, setDisplayOrder] = useState(plan?.display_order?.toString() ?? '0')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!isEditing) {
      setSlug(slugify(value))
    }
  }

  function addBenefit() {
    setBenefits([...benefits, ''])
  }

  function removeBenefit(idx: number) {
    setBenefits(benefits.filter((_, i) => i !== idx))
  }

  function updateBenefit(idx: number, value: string) {
    const updated = [...benefits]
    updated[idx] = value
    setBenefits(updated)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const input = {
      title,
      slug,
      description,
      benefits: benefits.filter(Boolean),
      price: parseFloat(price),
      currency: 'ARS',
      goal: goal as Plan['goal'],
      is_active: true,
      display_order: parseInt(displayOrder),
    }

    const result = isEditing && plan
      ? await updatePlan(plan.id, input)
      : await createPlan(input)

    if ('error' in result && result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    toast.success(isEditing ? 'Plan actualizado' : 'Plan creado')
    router.push('/admin/planes')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <Alert className="border-red-500/30 bg-red-500/10">
          <AlertDescription className="text-red-400 text-sm">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm">Título</Label>
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Plan Pérdida de Grasa"
            required
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300 text-sm">Slug</Label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="perdida-de-grasa"
            required
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300 text-sm">Descripción</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describí el plan y sus objetivos..."
          rows={4}
          required
          className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm">Precio (ARS)</Label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="15000"
            min="0"
            step="100"
            required
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300 text-sm">Objetivo</Label>
          <Select value={goal} onValueChange={(v) => setGoal(v as Plan['goal'])} required>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/10">
              <SelectItem value="fat_loss" className="text-white">Pérdida de Grasa</SelectItem>
              <SelectItem value="hypertrophy" className="text-white">Masa Muscular</SelectItem>
              <SelectItem value="body_recomposition" className="text-white">Recomposición</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300 text-sm">Orden de display</Label>
          <Input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
            min="0"
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
      </div>

      {/* Benefits */}
      <div className="space-y-3">
        <Label className="text-gray-300 text-sm">Beneficios / features</Label>
        {benefits.map((benefit, idx) => (
          <div key={idx} className="flex gap-2">
            <Input
              value={benefit}
              onChange={(e) => updateBenefit(idx, e.target.value)}
              placeholder={`Beneficio ${idx + 1}`}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
            />
            {benefits.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeBenefit(idx)}
                className="text-red-400 hover:text-red-300 flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addBenefit}
          className="border-white/15 text-gray-300 hover:text-white gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Agregar beneficio
        </Button>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            isEditing ? 'Guardar cambios' : 'Crear plan'
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white"
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
