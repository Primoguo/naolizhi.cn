import EarParticles from "@/sections/EarParticles";
import Navbar from "@/sections/Navbar";
import Hero from "@/sections/Hero";
import Features from "@/sections/Features";
import Highlights from "@/sections/Highlights";
import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";

function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-foreground antialiased">
      <EarParticles />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Features />
        <Highlights />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
