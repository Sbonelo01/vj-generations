import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/vj-logo.jpg.asset.json";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/submit", label: "Share Photos" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo.url}
            alt="VJ Generation"
            className="h-11 w-11 rounded-full object-cover ring-1 ring-primary/50 group-hover:ring-primary transition"
          />
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-widest text-foreground">
              VJ <span className="text-gold">GENERATION</span>
            </div>
            <div className="font-script text-xs text-gold/80 -mt-0.5">Create Memories</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm text-muted-foreground hover:text-gold transition-colors relative"
              activeProps={{ className: "text-gold" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="ml-2 px-5 py-2 text-xs font-semibold tracking-widest uppercase text-primary-foreground rounded-full transition hover:brightness-110"
            style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
          >
            Book Now
          </Link>
        </nav>

        <button
          className="lg:hidden text-gold p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-border">
          <div className="px-4 py-4 flex flex-col gap-3">
            {navItems.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-2 text-foreground hover:text-gold"
                activeProps={{ className: "text-gold" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/50 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo.url} alt="VJ Generation" className="h-12 w-12 rounded-full" />
            <div>
              <div className="font-bold tracking-widest">VJ <span className="text-gold">GENERATION</span></div>
              <div className="font-script text-gold text-sm">Create Memories</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            Cinematic videography & photography, capturing the moments that matter across KZN and beyond.
          </p>
        </div>
        <div>
          <h4 className="text-gold uppercase text-xs tracking-[0.3em] mb-4">Visit Us</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3"><MapPin size={16} className="text-gold shrink-0 mt-0.5" /> 20 Concord Avenue, Westridge, Durban 4000</li>
            <li className="flex gap-3"><Mail size={16} className="text-gold shrink-0 mt-0.5" /> hello@vjgenerations.co.za</li>
            <li className="flex gap-3"><Phone size={16} className="text-gold shrink-0 mt-0.5" /> 081 060 0569 / 067 138 1015</li>
          </ul>
        </div>
        <div>
          <h4 className="text-gold uppercase text-xs tracking-[0.3em] mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            {navItems.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="text-muted-foreground hover:text-gold transition">{n.label}</Link>
              </li>
            ))}
            <li><Link to="/auth" className="text-muted-foreground hover:text-gold transition">Admin sign in</Link></li>
          </ul>
          <div className="flex gap-3 mt-5">
            <a href="#" aria-label="Instagram" className="p-2 rounded-full border border-border hover:border-gold hover:text-gold transition"><Instagram size={16} /></a>
            <a href="#" aria-label="Facebook" className="p-2 rounded-full border border-border hover:border-gold hover:text-gold transition"><Facebook size={16} /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} VJ Generation · vjgenerations.co.za · All rights reserved
      </div>
    </footer>
  );
}