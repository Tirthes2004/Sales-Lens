import { Building2 } from 'lucide-react';

const About = () => {
  return (
    <section
      id="about"
      className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-8"
    >
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/70">
            About Company
          </p>

          <h2 className="mt-4 text-5xl font-bold leading-tight">
            Building futuristic analytics experiences.
          </h2>

          <p className="mt-6 text-lg leading-8 text-white/60">
            Sales-Len Analytics transforms spreadsheet data
            into intelligent visual dashboards.
          </p>

          <p className="mt-4 text-lg leading-8 text-white/60">
            Our platform focuses on AI-driven insights,
            realtime analytics and premium user
            experiences.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {[
            {
              title: '10K+',
              desc: 'Businesses using analytics',
            },
            {
              title: '99.9%',
              desc: 'Platform uptime',
            },
            {
              title: 'Realtime',
              desc: 'Dashboard generation',
            },
            {
              title: 'AI Ready',
              desc: 'Smart insight engine',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl"
            >
              <Building2 className="h-8 w-8 text-cyan-300" />

              <h3 className="mt-5 text-3xl font-bold">
                {card.title}
              </h3>

              <p className="mt-3 text-white/55">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;