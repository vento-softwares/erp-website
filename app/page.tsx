import { Analytics } from '@/components/analytics/Analytics';
import { MagneticEffect } from '@/components/motion/MagneticEffect';
import { Features } from '@/components/landing/Features';
import { Future } from '@/components/landing/Future';
import { Hero } from '@/components/landing/Hero';
import { Impact } from '@/components/landing/Impact';
import { Loader } from '@/components/landing/Loader';
import { ProductPreview } from '@/components/landing/ProductPreview';
import { Roadmap } from '@/components/landing/Roadmap';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { Vision } from '@/components/landing/Vision';
import { WaitlistSection } from '@/components/landing/WaitlistSection';

export default function HomePage() {
  return (
    <div className="overflow-x-clip bg-ink text-fg">
      <Loader />
      <SiteHeader />
      <main>
        <Hero />
        <Vision />
        <ProductPreview />
        <Features />
        <Impact />
        <Roadmap />
        <Future />
        <WaitlistSection />
      </main>
      <SiteFooter />
      <MagneticEffect />
      <Analytics />
    </div>
  );
}
