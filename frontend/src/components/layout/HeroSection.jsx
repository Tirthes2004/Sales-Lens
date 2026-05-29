import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom";

import heroImage from "../../assets/hero-image.png";

const HeroSection = () => {
  const navigate =
    useNavigate();

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-[72px]"
    >
      {/* top left glow */}
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />

      {/* bottom right glow */}
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

      {/* main container */}
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-6 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        
        {/* left content */}
        <div className="order-1 max-w-4xl">
          
          {/* badge */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs text-cyan-200 sm:text-sm"
          >
            <Sparkles className="h-4 w-4" />

            AI Powered Spreadsheet Analytics
          </motion.div>

          {/* title */}
          <motion.h1
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            className="font-handwritten text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
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
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            className="mt-6 max-w-2xl text-base leading-7 text-white/60 sm:text-lg"
          >
            Drag & drop spreadsheets and generate
            beautiful dashboards, analytics and realtime
            insights using your backend engine.
          </motion.p>

          {/* buttons */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.9,
            }}
            className="mt-8 flex flex-col gap-4 sm:flex-row"
          >
            {/* analyze button navigate */}
            <button
              onClick={() => {
                const section =
                  document.getElementById(
                    "analyze"
                  );

                if (section) {
                  section.scrollIntoView({
                    behavior:
                      "smooth",
                  });
                }
              }}
              className="group flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#020617] transition hover:scale-[1.03]"
            >
              Start Analyzing

              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>

            {/* history dashboard uploads */}
            <button
              onClick={() =>
                navigate(
                  "/uploads"
                )
              }
              className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold backdrop-blur-xl transition hover:border-cyan-400/30 hover:bg-white/10"
            >
              Explore Dashboard
            </button>
          </motion.div>
        </div>

       
        {/* heroImage */}
        <motion.div
          initial={{
            opacity: 0,
            x: 40,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 1,
          }}
          className="order-2 relative flex items-center justify-center lg:justify-end"
        >
          {/* cyan glow */}
          <div className="absolute h-[220px] w-[220px] rounded-full bg-cyan-400/20 blur-3xl" />

          {/* top floating card */}
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
            }}
            className="absolute left-2 top-4 rounded-2xl border border-cyan-400/20 bg-white/[0.05] px-3 py-2 backdrop-blur-xl"
          >
            <p className="text-[10px] text-cyan-300 sm:text-xs">
              Revenue Growth
            </p>

            <h3 className="mt-1 text-sm font-bold text-white sm:text-lg">
              +100%
            </h3>
          </motion.div>

          {/* rightside floating card */}
          <motion.div
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
            }}
            className="absolute bottom-8 right-2 rounded-2xl border border-violet-400/20 bg-white/[0.05] px-3 py-2 backdrop-blur-xl"
          >
            <p className="text-[10px] text-violet-300 sm:text-xs">
              AI Insights
            </p>

            <h3 className="mt-1 text-sm font-bold text-white sm:text-lg">
              High Accuracy
            </h3>
          </motion.div>

          {/* moving line */}
          <motion.div
            animate={{
              x: [-20, 20, -20],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
            }}
            className="absolute left-4 top-1/2 h-[2px] w-16 bg-gradient-to-r from-cyan-400 to-transparent opacity-70"
          />

          {/* robot imageE */}
          <motion.img
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
            }}
            src={heroImage}
            alt="AI Robot"
            className="relative z-10 mt-8 w-[170px] sm:w-[220px] md:w-[240px] lg:mt-0 lg:w-[300px] xl:w-[340px] object-contain drop-shadow-[0_0_30px_rgba(34,211,238,0.18)]"
          />

          {/* bottom badge */}
          <motion.div
            animate={{
              x: [-10, 10, -10],
            }}
            transition={{
              repeat: Infinity,
              duration: 6,
            }}
            className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 rounded-full border border-white/10 bg-black/40 px-4 py-2 backdrop-blur-xl"
          >
            <span className="text-[10px] tracking-widest text-cyan-300 sm:text-xs">
              POWERED BY GEMINI AI
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;