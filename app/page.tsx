import About from '@/components/About';
import Contact from '@/components/Contact';
import Faq from '@/components/Faq';
import Founder from '@/components/Founder';
import Hero from '@/components/Hero';
import Portfolio from '@/components/Portfolio';
import Process from '@/components/Process';
import ServiceDetails from '@/components/ServiceDetails';
import Services from '@/components/Services';
import Technologies from '@/components/Technologies';
import Testimonials from '@/components/Testimonials';
import WhyUs from '@/components/WhyUs';

/**
 * Single-page landing site. Section order mirrors the navigation and the
 * JSON-LD graph rendered in the root layout.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <ServiceDetails />
      <WhyUs />
      <Technologies />
      <Portfolio />
      <Process />
      <Founder />
      <Testimonials />
      <Faq />
      <Contact />
    </>
  );
}
