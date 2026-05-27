// src/components/layout/Footer.jsx

const Footer = () => {
  return (
    <footer className="relative overflow-hidden ">
      {/* TOP LINE */}
      <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 py-10 lg:flex-row lg:px-8">
        {/* LEFT */}
        <div className="max-w-md">
          <h2 className="font-handwritten text-2xl font-bold tracking-tight text-white">
            Sales Lens
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-white/45">
            AI-powered analytics platform
            for CSV and Excel business
            intelligence dashboards.
          </p>
        </div>

        {/* CENTER */}
        {/* CENTER */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/55">
        {[
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
        ].map((link) => (
            <button
            key={link.id}
            onClick={() => {
                const section =
                document.getElementById(
                    link.id
                );

                if (section) {
                section.scrollIntoView({
                    behavior: 'smooth',
                });
                }
            }}
            className="font-kpi transition hover:text-cyan-300"
            >
            {link.name}
            </button>
        ))}
        </div>
        {/* RIGHT */}
        <div className="text-center lg:text-right">
          <p className="text-sm text-white/35">
            © 2026 Sales Lens
          </p>

          <p className="mt-1 text-xs text-white/25">
            All rights reserved
          </p>
        </div>
      </div>

      {/* BOTTOM CREDIT */}
      <div className="border-t border-white/5 py-4 text-center">
        <a
          href="https://www.flaticon.com/free-icons/data-science"
          title="data science icons"
          target="_blank"
          rel="noreferrer"
          className="text-[11px] text-white/30 transition hover:text-cyan-300"
        >
          Data science icons created by
          Vectors Tank - Flaticon
        </a>
      </div>
    </footer>
  );
};

export default Footer;