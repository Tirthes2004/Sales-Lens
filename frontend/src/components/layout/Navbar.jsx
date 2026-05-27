import { useState } from 'react';

import {
  Menu,
} from 'lucide-react';

import MobileSidebar from './MobileSidebar';

import logo from '../../assets/logo.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const navLinks = [
    {
      name: 'Home',
      id: 'home',
    },
    {
      name: 'About',
      id: 'about',
    },
    {
      name: 'Features',
      id: 'features',
    },
    {
      name: 'Analyze',
      id: 'analyze',
    },
    {
      name: 'Contact',
      id: 'contact',
    },
  ];

  const scrollToSection = (id) => {
    const section =
      document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <header className="fixed left-0 top-0 z-50 w-full">
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <div className="flex h-[68px] items-center justify-between">
            {/* left section */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl ">
                <img
                  src={logo}
                  alt="Sales Lens Logo"
                  className="h-7 w-7 object-contain"
                />
              </div>

              <div>
                <h1 className="font-kpi text-sm font-semibold tracking-wide text-white">
                  Sales Lens
                </h1>

                <p className="font-handwritten text-[11px] text-white/45">
                  AI Analytics
                </p>
              </div>
            </div>

            {/* central part */}
            <nav className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() =>
                    scrollToSection(
                      link.id
                    )
                  }
                  className="font-kpi text-sm font-medium text-white/65 transition hover:text-cyan-300"
                >
                  {link.name}
                </button>
              ))}
            </nav>

            {/* right section in dev */}
            <div className="hidden items-center gap-3 md:flex">
              <button className="font-kpi rounded-full bg-white/[0.04] px-5 py-2 text-sm font-medium text-white/80 transition hover:bg-white/[0.08] border">
                Login
              </button>

              <button className="font-kpi rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-[#020617] transition hover:scale-[1.03]">
                Sign Up
              </button>
            </div>

            {/* for mobile view  */}
            <button
              onClick={() =>
                setMenuOpen(true)
              }
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] md:hidden"
            >
              <Menu className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      <MobileSidebar
        isOpen={menuOpen}
        closeMenu={() =>
          setMenuOpen(false)
        }
      />
    </>
  );
};

export default Navbar;