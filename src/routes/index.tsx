import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Camera, Radio, Mic, Building2, Sparkles, Briefcase, ArrowRight, Play, MapPin } from "lucide-react";
import hero from "@/assets/hero.jpg.asset.json";
import wedding from "@/assets/service-wedding.jpg.asset.json";
import livestream from "@/assets/service-livestream.jpg.asset.json";
import corporate from "@/assets/service-corporate.jpg.asset.json";
import { fetchGallery } from "@/lib/gallery";

export const Route = createFileRoute("/")({
  component: Index,
});

const services = [
  { icon: Camera, title: "Wedding Photography", desc: "Timeless imagery of your once-in-a-lifetime moments." },
  { icon: Radio, title: "Live Streaming", desc: "Multi-camera broadcasts to any platform, anywhere." },
  { icon: Mic, title: "Live Recording", desc: "Studio-quality audio & video captured on location." },
  { icon: Building2, title: "Corporate Events", desc: "Polished coverage for conferences, launches & summits." },
  { icon: Sparkles, title: "Traditional Functions", desc: "Cultural celebrations captured with reverence and heart." },
  { icon: Briefcase, title: "Business Profiling", desc: "Cinematic brand films that make your business unmissable." },
];

function Index() {
  const { data: gallery } = useQuery({ queryKey: ["gallery"], queryFn: fetchGallery });
  const preview = (gallery ?? []).slice(0, 6);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden -mt-[72px] pt-[72px] film-grain">
        <img
          src={hero.url}
          alt="VJ Generation filming a wedding"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-fade)" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 grid lg:grid-cols-2 gap-10 items-center w-full">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/40 text-gold text-[11px] uppercase tracking-[0.3em] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" /> Durban · Est. VJ Generation
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.02]">
              We don't shoot moments.
              <br />
              <span className="gradient-gold-text">We create memories.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Weddings. Live events. Corporate stories. Traditional celebrations. VJ Generation is a Durban-based videography & photography team obsessed with capturing the feeling behind every frame.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-primary-foreground font-semibold text-sm tracking-wide"
                style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
              >
                Book your date <ArrowRight size={16} />
              </Link>
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-gold text-foreground text-sm"
              >
                <Play size={14} className="text-gold" /> View our work
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div><span className="text-gold text-2xl font-serif">200+</span><br />Events captured</div>
              <div><span className="text-gold text-2xl font-serif">6</span><br />Signature services</div>
              <div><span className="text-gold text-2xl font-serif">100%</span><br />Durban-born</div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-gold uppercase text-xs tracking-[0.4em] mb-3">What we do</div>
          <h2 className="text-4xl sm:text-5xl font-bold">Signature services</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Every story is different. Every service is crafted around yours.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.title}
              className="group relative p-8 rounded-2xl bg-card border border-border hover:border-gold/60 transition overflow-hidden"
            >
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gold/10 blur-3xl group-hover:bg-gold/20 transition" />
              <s.icon className="text-gold mb-5" size={32} strokeWidth={1.5} />
              <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SHOWCASE STRIP */}
      <section className="relative py-24 bg-card/40 border-y border-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-3 gap-4">
          {[wedding, livestream, corporate].map((img, i) => (
            <div key={i} className="frame-gold relative aspect-[4/5] overflow-hidden rounded-sm">
              <img src={img.url} alt="" className="w-full h-full object-cover transition duration-700 hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="text-gold uppercase text-xs tracking-[0.4em] mb-3">The gallery</div>
            <h2 className="text-4xl sm:text-5xl font-bold">Recent memories</h2>
          </div>
          <Link to="/gallery" className="text-gold hover:underline text-sm inline-flex items-center gap-1">
            See full gallery <ArrowRight size={14} />
          </Link>
        </div>
        {preview.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-xl text-muted-foreground">
            Fresh work is being added soon. In the meantime — <Link to="/submit" className="text-gold hover:underline">share yours</Link>.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {preview.map((img) => (
              <div key={img.id} className="frame-gold aspect-square overflow-hidden">
                <img src={img.url} alt={img.caption ?? ""} className="w-full h-full object-cover hover:scale-105 transition duration-700" loading="lazy" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto relative rounded-3xl overflow-hidden p-12 md:p-16 border border-gold/30 bg-card text-center">
          <div className="absolute inset-0 opacity-20" style={{ background: "var(--gradient-gold)" }} />
          <div className="relative">
            <div className="font-script text-gold text-2xl mb-3">let's create together</div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">Ready to make your event unforgettable?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Whether it's a wedding, a corporate launch or a traditional celebration — let's craft it into something you'll rewatch for years.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-primary-foreground font-semibold"
              style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
            >
              Get in touch <ArrowRight size={16} />
            </Link>
            <div className="mt-6 text-sm text-muted-foreground inline-flex items-center gap-2">
              <MapPin size={14} className="text-gold" /> 20 Concord Avenue, Westridge, Durban 4000
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
