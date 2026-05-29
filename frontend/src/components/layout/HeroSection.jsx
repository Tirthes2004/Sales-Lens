import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-[72px]"
    >
      {/* glow part */}
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-7xl items-center px-6 py-16 lg:px-8">
        <div className="max-w-4xl">
          {/* badge icon  */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs text-cyan-200 sm:text-sm"
          >
            <Sparkles className="h-4 w-4" />
            AI Powered Spreadsheet Analytics
          </motion.div>

          {/* title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className=" font-handwritten text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
            Upload CSV &
            <br />
            Excel Files.
            <br />

            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Transform Data Into Insights.
            </span>
          </motion.h1>

          {/* description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-6 max-w-2xl text-base leading-7 text-white/60 sm:text-lg"
          >
            Drag & drop spreadsheets and generate
            beautiful dashboards, analytics and realtime
            insights using your backend engine.
          </motion.p>

          {/* buttons to navigate to analyze section and dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="mt-8 flex flex-col gap-4 sm:flex-row"
          >
            <button onClick={() => {
                    const section =
                      document.getElementById(
                        "analyze"
                      );

                    if (section) {
                      section.scrollIntoView({
                        behavior: "smooth",
                      });
                    }
                  }} className="group flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#020617] transition hover:scale-[1.03]">
              Start Analyzing

              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>

            <button onClick={() =>
                    navigate("/uploads")
                  } className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold backdrop-blur-xl transition hover:border-cyan-400/30 hover:bg-white/10">
              Explore Dashboard
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;