{/*in dev*/}
const NarrativeSection = ({ narrative }) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-2xl font-bold">
        AI Narrative Summary
      </h2>

      <p className="mt-6 whitespace-pre-line leading-8 text-white/70">
        {narrative}
      </p>
    </div>
  );
};

export default NarrativeSection;