// src/components/layout/Navbar.jsx

import {
  FileSpreadsheet,
  Menu,
} from 'lucide-react';

const Navbar = ({ openMenu }) => {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#020617]/75 backdrop-blur-2xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
            <FileSpreadsheet className="h-5 w-5 text-cyan-300" />
          </div>

          <div>
            <h1 className="text-base font-bold tracking-wide">
              Sales-Len Analytics
            </h1>

            <p className="text-[11px] text-white/40">
              AI Spreadsheet Platform
            </p>
          </div>
        </div>

        {/* CENTER */}
        <nav className="hidden items-center gap-8 text-[14px] font-medium text-white/65 md:flex">
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
        </nav>

        {/* RIGHT */}
        <div className="hidden items-center gap-3 md:flex">
          <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-cyan-400/30 hover:bg-white/10">
            Login
          </button>

          <button className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-[#020617] transition hover:scale-[1.03]">
            Sign Up
          </button>
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={openMenu}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;