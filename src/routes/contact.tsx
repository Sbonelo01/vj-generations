import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Mail, Phone, Clock, PackageCheck } from "lucide-react";

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): { pkg?: string } => ({
    pkg: typeof search.pkg === "string" ? search.pkg : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Contact — VJ Generation, Durban" },
      { name: "description", content: "Get in touch with VJ Generation. Based at 20 Concord Avenue, Westridge, Durban 4000." },
      { property: "og:title", content: "Contact VJ Generation" },
      { property: "og:description", content: "Book VJ Generation for your next event in Durban." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { pkg } = Route.useSearch();
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-14">
        <div className="text-gold uppercase text-xs tracking-[0.4em] mb-3">Say hello</div>
        <h1 className="text-4xl sm:text-6xl font-bold">Let's create together</h1>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Tell us about your event and we'll come back with ideas and a quote.</p>
      </div>

      {pkg && (
        <div className="mb-8 flex items-center gap-4 p-5 rounded-2xl border border-gold/50 bg-gold/10">
          <div className="p-3 rounded-full text-primary-foreground shrink-0" style={{ background: "var(--gradient-gold)" }}>
            <PackageCheck size={20} />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-gold">Your selected package</div>
            <div className="font-semibold text-lg">{pkg}</div>
            <div className="text-sm text-muted-foreground">Complete the form below and we'll confirm availability for your date.</div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="p-8 rounded-2xl bg-card border border-border space-y-6">
          <Info icon={MapPin} title="Studio">
            20 Concord Avenue<br />Westridge, Durban 4000
          </Info>
          <Info icon={Mail} title="Email">
            <a href="mailto:hello@vjgenerations.co.za" className="hover:text-gold">hello@vjgenerations.co.za</a>
          </Info>
          <Info icon={Phone} title="Phone">081 060 0569 / 067 138 1015</Info>
          <Info icon={Clock} title="Hours">Mon – Sat · 09:00 – 18:00<br />Events on Sundays by arrangement</Info>
        </div>

        <form
          className="p-8 rounded-2xl bg-card border border-border space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            const body = `Name: ${f.get("name")}%0D%0APhone: ${f.get("phone")}%0D%0AEvent: ${f.get("event")}%0D%0A%0D%0A${f.get("msg")}`;
            window.location.href = `mailto:hello@vjgenerations.co.za?subject=${encodeURIComponent(pkg ? `Booking enquiry: ${pkg}` : "Booking enquiry")}&body=${body}`;
          }}
        >
          <Field name="name" label="Your name" required />
          <Field name="email" label="Email" type="email" required />
          <Field name="phone" label="Phone" />
          <Field name="event" label="Event type" placeholder="Wedding, corporate, live stream…" defaultValue={pkg} />
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Tell us about your event</span>
            <textarea
              name="msg"
              rows={5}
              defaultValue={pkg ? `Hi VJ Generation, I'd like to book the ${pkg}. My event date is ` : ""}
              className="w-full p-3 bg-secondary border border-border rounded-lg outline-none focus:border-gold"
            />
          </label>
          <button className="w-full py-3 rounded-full text-primary-foreground font-semibold" style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}>
            Send enquiry
          </button>
        </form>
      </div>

      <div className="mt-12 rounded-2xl overflow-hidden border border-border">
        <iframe
          title="VJ Generation studio location"
          src="https://www.google.com/maps?q=20+Concord+Avenue,+Westridge,+Durban+4000&output=embed"
          width="100%"
          height="360"
          style={{ border: 0, filter: "grayscale(0.4) contrast(1.1)" }}
          loading="lazy"
        />
      </div>
    </div>
  );
}

function Info({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="p-3 rounded-full bg-gold/10 text-gold h-fit"><Icon size={20} /></div>
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{title}</div>
        <div className="mt-1 text-foreground">{children}</div>
      </div>
    </div>
  );
}

function Field({ name, label, type = "text", placeholder, defaultValue, required }: { name: string; label: string; type?: string; placeholder?: string; defaultValue?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">{label}{required && " *"}</span>
      <input name={name} type={type} required={required} placeholder={placeholder} defaultValue={defaultValue}
        className="w-full p-3 bg-secondary border border-border rounded-lg outline-none focus:border-gold" />
    </label>
  );
}