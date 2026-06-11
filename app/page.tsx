import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/marketing/hero-section'
import { AboutSection } from '@/components/marketing/about-section'
import { HowItWorksSection } from '@/components/marketing/how-it-works-section'
import { PlansSection } from '@/components/marketing/plans-section'
import { CertificationsSection } from '@/components/marketing/certifications-section'
import { FaqSection } from '@/components/marketing/faq-section'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <PlansSection />
        <AboutSection />
        <CertificationsSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  )
}
