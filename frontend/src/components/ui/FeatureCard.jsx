const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl transition hover:-translate-y-2 hover:border-cyan-400/20">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="mt-6 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-4 text-sm leading-7 text-white/55">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;