import FeatureCard from '../components/ui/FeatureCard';

import { features } from '../data/landingData';

const Features = () => {
  return (
    <section
      id="features"
      className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-8"
    >
      <div className="max-w-2xl">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/70">
          Platform Features
        </p>

        <h2 className="mt-4 text-4xl font-bold leading-tight">
          Built for futuristic analytics products.
        </h2>

        <p className="mt-5 text-lg leading-8 text-white/55">
          Premium UI components designed for modern AI
          spreadsheet analysis platforms.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
};

export default Features;