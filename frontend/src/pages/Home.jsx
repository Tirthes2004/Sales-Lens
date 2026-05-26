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

const Home = () => {
  const {
    mobileMenu,
    openMenu,
    closeMenu,
  } = useMobileMenu();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_30%)]" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:80px_80px]" />

      {/* Navbar */}
      <Navbar openMenu={openMenu} />

      {/* Mobile Sidebar */}
      <MobileSidebar
        mobileMenu={mobileMenu}
        closeMenu={closeMenu}
      />

      {/* Hero Section */}
      <section id="home">
        <HeroSection />
      </section>

      {/* Metrics Section */}
      <section className="relative z-10 mx-auto grid max-w-7xl gap-6 px-6 pb-20 md:grid-cols-3 lg:px-8">
        {metrics.map((item) => (
          <div
            key={item.label}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl"
          >
            <h2 className="text-4xl font-bold">
              {item.value}
            </h2>

            <p className="mt-2 text-white/55">
              {item.label}
            </p>
          </div>
        ))}
      </section>

      {/* About */}
      <About />

      {/* Features */}
      <Features />

      {/* Analyze */}
      <Analyze />

      {/* Contact */}
      <Contact />

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center text-sm text-white/45 md:flex-row">
          <p>
            © 2026 Sales-Len Analytics. All rights
            reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="#home"
              className="transition hover:text-cyan-300"
            >
              Home
            </a>

            <a
              href="#about"
              className="transition hover:text-cyan-300"
            >
              About
            </a>

            <a
              href="#features"
              className="transition hover:text-cyan-300"
            >
              Features
            </a>

            <a
              href="#analyze"
              className="transition hover:text-cyan-300"
            >
              Analyze
            </a>

            <a
              href="#contact"
              className="transition hover:text-cyan-300"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;