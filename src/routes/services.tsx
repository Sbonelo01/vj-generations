import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, Radio, Mic, Building2, Sparkles, Briefcase, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — VJ Generation" },
      { name: "description", content: "Wedding photography, live streaming & recording, corporate events, traditional functions and business profiling in Durban." },
      { property: "og:title", content: "Services — VJ Generation" },
      { property: "og:description", content: "Explore what VJ Generation captures for you." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { icon: Camera, title: "Wedding Photography", desc: "From the first look to the last dance — a full-day story told frame by frame." },
  { icon: Radio, title: "Live Streaming", desc: "Multi-camera broadcasts to YouTube, Facebook, Zoom or a private URL." },
  { icon: Mic, title: "Live Recording", desc: "Concerts, sermons, launches — captured with broadcast-grade audio & video." },
  { icon: Building2, title: "Corporate Events", desc: "Conferences, product launches, gala dinners — polished, professional, on brand." },
  { icon: Sparkles, title: "Traditional Functions", desc: "Umembeso, lobola, umemulo — cultural moments captured with respect and heart." },
  { icon: Briefcase, title: "Business Profiling", desc: "Brand films & founder stories that turn your company into a headline." },
];

function ServicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-14 max-w-2xl mx-auto">
        <div className="text-gold uppercase text-xs tracking-[0.4em] mb-3">Our craft</div>
        <h1 className="text-4xl sm:text-6xl font-bold">Everything we capture</h1>
        <p className="text-muted-foreground mt-4">One team. Six signature services. Zero cookie-cutter packages.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div key={s.title} className="p-8 rounded-2xl bg-card border border-border hover:border-gold/60 transition">
            <s.icon className="text-gold mb-4" size={32} strokeWidth={1.5} />
            <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-16 text-center">
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-primary-foreground font-semibold"
          style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
        >
          Request a quote <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}