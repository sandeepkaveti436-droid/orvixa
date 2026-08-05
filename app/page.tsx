import Navbar from "@/src/components/Navbar";
import HeroSection from "@/src/components/HeroSection";
import TrustedBy from "@/src/components/TrustedBy";
import Features from "@/src/components/Features";
import HowItWorks from "@/src/components/HowItWorks";
import Products from "@/src/components/Products";
import Pricing from "@/src/components/Pricing";
import Testimonials from "@/src/components/Testimonials";
import FAQ from "@/src/components/FAQ";
import CTA from "@/src/components/CTA";
import Footer from "@/src/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans relative overflow-hidden">
      <Navbar />
      <HeroSection />
      <TrustedBy />
      <Features />
      <Products />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
