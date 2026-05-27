import {
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';

const Contact = () => {
  return (
    <section
      id="contact"
      className="relative z-10 mx-auto max-w-7xl px-6 py-40 lg:px-8"
    >
      <div className="grid gap-10 lg:grid-cols-2">
        {/*the left part of contact page */}
        <div>
          <p className="font-pixel text-sm uppercase tracking-[0.35em] text-cyan-300/70">
            Contact Us
          </p>

          <h2 className="font-handwritten mt-4 text-5xl font-bold leading-tight">
            Let’s build something amazing.
          </h2>

          <p className="mt-6 text-lg leading-8 text-white/60">
            Contact our team for integrations,
            enterprise solutions and support.
          </p>
        </div>
        {/*below data passed as parameters in map to create cards consisting respective data. icons are imported from lucide-react*/}
        <div className="space-y-6">
          {[
            {
              icon: Mail,
              title: 'Email',
              value: 'support@saleslenanalytics.com',
            },
            {
              icon: Phone,
              title: 'Phone',
              value: '+91 9876543210',
            },
            {
              icon: MapPin,
              title: 'Location',
              value: 'Kolkata, India',
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex items-start gap-5 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                  <Icon className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="font-kpi text-xl font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-white/55">
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Contact;