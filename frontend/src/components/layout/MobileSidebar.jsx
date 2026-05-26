import { motion } from 'framer-motion';

import {
  FileSpreadsheet,
  Home,
  Info,
  Mail,
  Sparkles,
  UploadCloud,
  X,
} from 'lucide-react';

const navItems = [
  {
    title: 'Home',
    href: '#home',
    icon: Home,
  },
  {
    title: 'About',
    href: '#about',
    icon: Info,
  },
  {
    title: 'Features',
    href: '#features',
    icon: Sparkles,
  },
  {
    title: 'Analyze',
    href: '#analyze',
    icon: UploadCloud,
  },
  {
    title: 'Contact',
    href: '#contact',
    icon: Mail,
  },
];

const MobileSidebar = ({
  mobileMenu,
  closeMenu,
}) => {
  if (!mobileMenu) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={closeMenu}
      />

      {/* SIDEBAR */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.35 }}
        className="absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col border-l border-white/10 bg-[#071120]/95 p-6 shadow-2xl backdrop-blur-2xl"
      >
        {/* TOP */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10">
              <FileSpreadsheet className="h-5 w-5 text-cyan-300" />
            </div>

            <div>
              <h2 className="font-bold">
                Sales-Len Analytics
              </h2>

              <p className="text-xs text-white/45">
                Mobile Navigation
              </p>
            </div>
          </div>

          <button
            onClick={closeMenu}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* LINKS */}
        <div className="mt-10 space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.title}
                href={item.href}
                onClick={closeMenu}
                className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-medium text-white/80 transition hover:border-cyan-400/20 hover:bg-cyan-400/10 hover:text-white"
              >
                <Icon className="h-5 w-5 text-cyan-300" />

                {item.title}
              </a>
            );
          })}
        </div>

        {/* BUTTONS */}
        <div className="mt-auto space-y-4">
          <button className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white">
            Login
          </button>

          <button className="w-full rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#020617]">
            Sign Up
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MobileSidebar;