{/* importing all components, hooks, data in home page */}
import Navbar from '../components/layout/Navbar';
import MobileSidebar from '../components/layout/MobileSidebar';
import HeroSection from '../components/layout/HeroSection';

import useMobileMenu from '../hooks/useMobileMenu';

import {
  metrics,
} from '../data/landingData';

import About from './About';
import Features from './Features';
import Analyze from './Analyze';
import Contact from './Contact';
import Footer from '../components/layout/Footer';

const Home = () => {
  const {
    mobileMenu,
    openMenu,
    closeMenu,
  } = useMobileMenu();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      {/* the glowing effects in background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_30%)]" />

      {/* the purple blue gradient  overlay */}
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:80px_80px]" />

      {/* navbar */}
      <Navbar openMenu={openMenu} />

      {/* Sidebar */}
      <MobileSidebar
        mobileMenu={mobileMenu}
        closeMenu={closeMenu}
      />

      {/* Hero Section */}
      <section id="home">
        <HeroSection />
      </section>

      {/* Metrics Section 
      <section className="relative z-10 mx-auto grid max-w-7xl gap-6 px-6 pb-20 md:grid-cols-3 lg:px-8">
        {metrics.map((item) => (
          <div
            key={item.label}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl"
          >
            <h2 className="font-kpi text-4xl font-bold">
              {item.value}
            </h2>

            <p className="mt-2 text-white/55">
              {item.label}
            </p>
          </div>
        ))}
      </section>*/}

      {/* About */}
      <About />

      {/* Features */}
      <Features />

      {/* Analyze */}
      <Analyze />

      {/* Contact */}
      <Contact />

      {/* Footer */}
      <Footer />
        
    </div>
  );
};

export default Home;