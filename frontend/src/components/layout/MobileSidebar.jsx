// src/components/layout/MobileSidebar.jsx

import { motion, AnimatePresence } from 'framer-motion';

import {
  X,
  ArrowRight,
} from 'lucide-react';

import logo from '../../assets/logo.png';

const MobileSidebar = ({
  isOpen,
  closeMenu,
}) => {
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

      closeMenu();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm md:hidden">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              duration: 0.35,
            }}
            className="absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-[#071120]/95 p-6"
          >
            {/* TOP */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-cyan-400/10">
                  <img
                    src={logo}
                    alt="Sales Lens Logo"
                    className="h-7 w-7 object-contain"
                  />
                </div>

                <div>
                  <h2 className="font-kpi font-semibold">
                    Sales Lens
                  </h2>

                  <p className="font-handwritten text-xs text-white/45">
                    AI Analytics
                  </p>
                </div>
              </div>

              <button
                onClick={closeMenu}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* NAV LINKS */}
            <div className="mt-10 space-y-3">
              {navLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    scrollToSection(
                      item.id
                    )
                  }
                  className="font-kpi flex w-full items-center justify-between rounded-2xl bg-white/5 px-5 py-4 text-left text-sm font-medium text-white/80"
                >
                  {item.name}

                  <ArrowRight className="h-4 w-4" />
                </button>
              ))}
            </div>

            {/* AUTH BUTTONS */}
            <div className="mt-auto space-y-3 pt-10">
              <button className="font-kpi w-full rounded-2xl bg-white/5 py-4 text-sm font-medium text-white/80 border">
                Login
              </button>

              <button className="font-kpi w-full rounded-2xl bg-cyan-400 py-4 text-sm font-semibold text-[#020617]">
                Sign Up
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;