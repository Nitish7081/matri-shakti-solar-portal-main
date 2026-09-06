import { Link } from "@tanstack/react-router";
import { Sun, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-sun">
              <Sun className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-display text-lg font-bold">Matri Shakti</div>
              <div className="text-xs text-primary-glow">Infrastructure</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/70">
            Authorized UPNEDA solar installation partner delivering rooftop solar under the
            PM Surya Ghar Muft Bijli Yojana across Uttar Pradesh.
          </p>
          <div className="mt-5 flex gap-3">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="social"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-primary-glow">
            Quick Links
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {[
              ["/about", "About Us"],
              ["/yojana", "PM Surya Ghar Yojana"],
              ["/calculator", "Subsidy Calculator"],
              ["/emi", "EMI Plans"],
              ["/gallery", "Gallery"],
              ["/complaint", "Customer Support & Complaints"],
              ["/faqs", "FAQs"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="transition hover:text-primary-glow">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-primary-glow">
            Services
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {[
              "Residential Solar",
              "Commercial Solar",
              "Industrial Solar",
              "On-Grid Systems",
              "Off-Grid Systems",
              "Hybrid Systems",
              "Solar Water Pump",
              "Solar Atta Chakki",
            ].map((s) => (
              <li key={s}>
                <Link to="/services" className="transition hover:text-primary-glow">
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-primary-glow">
            Contact
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary-glow" />
              <div>
                <a href="tel:+919721029235" className="block hover:text-primary-glow">
                  +91 97210 29235
                </a>
                <a href="tel:+919305827390" className="block hover:text-primary-glow">
                  +91 93058 27390
                </a>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary-glow" />
              <a
                href="mailto:matrishaktiinfrastructure@gmail.com"
                className="break-all hover:text-primary-glow"
              >
                matrishaktiinfrastructure@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-glow" />
              <span>Paniyara, Maharajganj, UP</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/60 md:flex-row md:px-6">
          <p>
            © {new Date().getFullYear()} Matri Shakti Infrastructure. All rights reserved.
          </p>
          <div className="flex gap-3">
            <Link to="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </Link>
            <span className="opacity-50">|</span>
            <Link to="/terms-and-conditions" className="hover:text-white">
              Terms & Conditions
            </Link>
            <span className="opacity-50">|</span>
            <a
              href={import.meta.env.VITE_ADMIN_URL || "http://localhost:5174"}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white text-white/40"
            >
              Admin Portal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
