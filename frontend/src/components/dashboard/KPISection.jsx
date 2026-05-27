const KPISection = ({ kpis }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {kpis.map((item) => (
        <div
          key={item.title}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <p className="text-sm text-white/50">
            {item.title}
            </p>

          <h2 className="mt-4 text-4xl font-bold">
            {item.value}
          </h2>

          <p className="mt-3 text-sm text-cyan-300">
            {item.change}
          </p>
        </div>
      ))}
    </div>
  );
};

export default KPISection;