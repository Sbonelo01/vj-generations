import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, Radio, Mic, Building2, Sparkles, Briefcase, ArrowRight, Check, Phone } from "lucide-react";
import weddingImg from "@/assets/service-wedding.jpg.asset.json";
import umembesoImg from "@/assets/pricing-umembeso.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Pricing — VJ Generation" },
      { name: "description", content: "Wedding photography, live streaming & recording, corporate events, traditional functions and business profiling in Durban. Wedding and Umembeso packages from R9 500." },
      { property: "og:title", content: "Services & Pricing — VJ Generation" },
      { property: "og:description", content: "Explore what VJ Generation captures for you. Packages from R9 500." },
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

type Pkg = { name: string; price: string; features: string[]; featured?: boolean };

const weddingPackages: Pkg[] = [
  {
    name: "Package 1",
    price: "R12 500",
    features: [
      "8 hours of coverage",
      "Photographer x1",
      "A4 Photobook 20 pages",
      "USB/Flash drive with pictures x1",
      "A3 Canvas x1",
      "Videographer x1",
      "4–5 minutes video for WhatsApp",
      "30–45 minutes edited video",
      "USB/Flash drive x1",
      "Drone",
    ],
  },
  {
    name: "Package 2",
    price: "R16 000",
    featured: true,
    features: [
      "8 hours of coverage",
      "Photographer x1",
      "A3 Photobook 24 pages",
      "USB/Flash drive with pictures x1",
      "A2 Canvas x1",
      "Videographer x2",
      "4–5 minutes video for WhatsApp",
      "30–45 minutes edited video",
      "USB/Flash drive x1",
      "Drone",
    ],
  },
  {
    name: "Package 3",
    price: "R20 000",
    features: [
      "8 hours of coverage",
      "Photographer x2",
      "A3 Photobook layflat 24 pages",
      "USB/Flash drive with pictures x1",
      "A2 Canvas x1",
      "Videographer x2",
      "4–5 minutes video for WhatsApp",
      "30–45 minutes edited video",
      "USB/Flash drive x1",
      "Drone",
    ],
  },
];

const umembesoPackages: Pkg[] = [
  {
    name: "Basic",
    price: "R9 500",
    features: [
      "8 hours of coverage",
      "Photographer x1",
      "A4 Photobook 20 pages",
      "USB/Flash drive with pictures x1",
      "Videographer x1",
      "4–5 minutes video for WhatsApp",
      "15–30 minutes edited video",
      "USB/Flash drive x1",
    ],
  },
  {
    name: "Silver",
    price: "R12 500",
    featured: true,
    features: [
      "8 hours of coverage",
      "Photographer x1",
      "A3 Photobook 24 pages",
      "USB/Flash drive with pictures x2",
      "A3 Canvas x1",
      "Videographer x2",
      "4–5 minutes video for WhatsApp",
      "15–30 minutes edited video",
      "USB/Flash drive x1",
      "Drone",
    ],
  },
  {
    name: "Gold",
    price: "R16 000",
    features: [
      "8 hours of coverage",
      "Photographer x2",
      "A3 Photobook layflat 24 pages",
      "USB/Flash drive with pictures x1",
      "A2 Canvas x1",
      "Videographer x2",
      "4–5 minutes video for WhatsApp",
      "30–45 minutes edited video",
      "USB/Flash drive x1",
      "Drone",
    ],
  },
];

function PackageCard({ pkg, group }: { pkg: Pkg; group: string }) {
  return (
    <div
      className={`relative p-8 rounded-2xl bg-card border transition flex flex-col ${
        pkg.featured ? "border-gold/70 shadow-[var(--shadow-gold)]" : "border-border hover:border-gold/50"
      }`}
    >
      {pkg.featured && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground"
          style={{ background: "var(--gradient-gold)" }}
        >
          Most popular
        </div>
      )}
      <h3 className="text-gold uppercase text-xs tracking-[0.3em] mb-2">{pkg.name}</h3>
      <div className="text-4xl font-serif font-bold mb-6">{pkg.price}</div>
      <ul className="space-y-2.5 text-sm text-muted-foreground flex-1">
        {pkg.features.map((f) => (
          <li key={f} className="flex gap-2.5">
            <Check size={15} className="text-gold shrink-0 mt-0.5" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        to="/contact"
        search={{ pkg: `${group} — ${pkg.name} (${pkg.price})` }}
        className={`mt-8 inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition ${
          pkg.featured
            ? "text-primary-foreground hover:brightness-110"
            : "border border-border hover:border-gold text-foreground"
        }`}
        style={pkg.featured ? { background: "var(--gradient-gold)" } : undefined}
      >
        Book this package <ArrowRight size={14} />
      </Link>
    </div>
  );
}

function PricingGroup({
  id,
  title,
  subtitle,
  image,
  imageAlt,
  packages,
}: {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  packages: Pkg[];
}) {
  return (
    <section id={id} className="py-20 scroll-mt-24">
      <div className="grid lg:grid-cols-[320px_1fr] gap-10 items-start">
        <div className="lg:sticky lg:top-28">
          <div className="frame-gold aspect-[4/5] overflow-hidden rounded-sm mb-6">
            <img src={image} alt={imageAlt} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="text-gold uppercase text-xs tracking-[0.4em] mb-3">{subtitle}</div>
          <h2 className="text-3xl sm:text-4xl font-bold">{title}</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {packages.map((p) => (
            <PackageCard key={p.name} pkg={p} group={title} />
          ))}
        </div>
      </div>
    </section>
  );
}

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

      <div className="text-center mt-28 mb-4 max-w-2xl mx-auto">
        <div className="text-gold uppercase text-xs tracking-[0.4em] mb-3">Pricing</div>
        <h2 className="text-4xl sm:text-5xl font-bold">Packages built for your day</h2>
        <p className="text-muted-foreground mt-4">
          Transparent pricing, no surprises. Every package includes professional editing and delivery on USB.
        </p>
      </div>

      <PricingGroup
        id="wedding-packages"
        title="Wedding Photography"
        subtitle="Wedding packages"
        image={weddingImg.url}
        imageAlt="Wedding photography by VJ Generation"
        packages={weddingPackages}
      />

      <PricingGroup
        id="umembeso-packages"
        title="Umembeso"
        subtitle="Traditional function packages"
        image={umembesoImg}
        imageAlt="Umembeso traditional ceremony captured by VJ Generation"
        packages={umembesoPackages}
      />

      <div className="mt-16 text-center border border-gold/30 rounded-3xl bg-card p-10">
        <div className="font-script text-gold text-2xl mb-2">contact us for more info</div>
        <p className="text-muted-foreground mb-2 flex items-center justify-center gap-2">
          <Phone size={15} className="text-gold" /> 081 060 0569 / 067 138 1015
        </p>
        <p className="text-muted-foreground mb-6 text-sm">Custom quotes available for live streaming, corporate events and business profiling.</p>
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
