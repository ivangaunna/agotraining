import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { WhatsAppButton } from '@/components/ui/whatsapp-button'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'AgoTraining — Planes de Entrenamiento Personalizados',
    template: '%s | AgoTraining',
  },
  description:
    'Transformá tu físico con un plan de entrenamiento diseñado para tu objetivo. Pérdida de grasa, masa muscular o recomposición corporal.',
  keywords: ['entrenamiento', 'fitness', 'planes de entrenamiento', 'pérdida de grasa', 'masa muscular', 'AgoTraining'],
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'AgoTraining',
    title: 'AgoTraining — Planes de Entrenamiento Personalizados',
    description: 'Transformá tu físico con un plan de entrenamiento diseñado para tu objetivo.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgoTraining — Planes de Entrenamiento Personalizados',
    description: 'Transformá tu físico con un plan de entrenamiento diseñado para tu objetivo.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-white">
        {children}
        <WhatsAppButton />
        <Toaster theme="dark" position="top-right" />
      </body>
    </html>
  )
}
