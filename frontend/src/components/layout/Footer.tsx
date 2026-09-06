import { Link } from "@tanstack/react-router";
import { Sun, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export function Footer() {
  const whatsappUrl =
    "https://wa.me/918948933657?text=" +
    encodeURIComponent("Hello Matri-Shakti Infrastructure, I want to inquire about Solar Rooftop Installation & PM Surya Ghar Subsidy.");

  return (
    <footer className="mt-20 bg-slate-900 text-slate-200 border-t-4 border-orange-500 shadow-2xl">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div>
          {/* Prominent Large Logo / Brand */}
          <Link to="/" className="inline-flex items-center gap-3.5 group">
            <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 shadow-lg shadow-orange-500/30 border border-white/20">
              <Sun className="h-7 w-7 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-display text-2xl font-black tracking-tight text-white">
                MATRI-SHAKTI
              </div>
              <div className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-amber-400">
                INFRASTRUCTURE
              </div>
            </div>
          </Link>

          <p className="mt-4 text-sm text-slate-300 leading-relaxed font-normal">
            Authorized UPNEDA rooftop solar installation partner powering homes, shops,
            and businesses under the PM Surya Ghar Muft Bijli Yojana across Uttar Pradesh.
          </p>

          <div className="mt-5 flex gap-3">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="social"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-300 transition hover:bg-orange-500 hover:text-slate-950 hover:border-orange-500"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-xs font-black uppercase tracking-wider text-amber-400">
            Quick Navigation
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
            {[
              ["/about", "About Us"],
              ["/yojana", "PM Surya Ghar Yojana"],
              ["/calculator", "Subsidy Calculator"],
              ["/solar-panels", "Solar Packages (1-20 KW)"],
              ["/emi", "EMI & Financing Plans"],
              ["/gallery", "Installation Gallery"],
              ["/complaint", "Customer Support & Complaints"],
              ["/faqs", "Frequently Asked Questions"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="transition hover:text-amber-400 hover:translate-x-1 inline-block">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-xs font-black uppercase tracking-wider text-amber-400">
            Solar Solutions
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
            {[
              "Residential Rooftop Solar",
              "Commercial & Office Solar",
              "Industrial Heavy-duty Solar",
              "On-Grid Net Metering Systems",
              "Off-Grid Battery Backup Systems",
              "Hybrid Solar Systems",
              "Solar Water Pumps (PM-KUSUM)",
              "Solar Atta Chakki Systems",
            ].map((s) => (
              <li key={s}>
                <Link to="/services" className="transition hover:text-amber-400 hover:translate-x-1 inline-block">
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-xs font-black uppercase tracking-wider text-amber-400">
            Contact &amp; Head Office
          </h4>
          <ul className="mt-4 space-y-3.5 text-sm text-slate-300">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-orange-400" />
              <span>Anil Singh, Madhonagar, Paniyara, Maharajganj, Uttar Pradesh 273310</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-orange-400" />
              <div className="flex flex-col">
                <a href="tel:+918948933657" className="font-bold text-white hover:text-amber-400">
                  +91 89489 33657
                </a>
                <a href="tel:+919305827390" className="text-xs text-slate-400 hover:text-amber-400">
                  Alt: +91 93058 27390
                </a>
              </div>
            </li>
            <li className="flex items-center gap-2.5">
              <FaWhatsapp className="h-4 w-4 shrink-0 text-emerald-400" />
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-300 hover:underline font-semibold"
              >
                WhatsApp Support (8948933657)
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-orange-400" />
              <a
                href="mailto:matrishaktiinfrastructure@gmail.com"
                className="text-xs hover:text-amber-400 break-all"
              >
                matrishaktiinfrastructure@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row md:px-6">
          <p>© {new Date().getFullYear()} Matri Shakti Infrastructure. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-amber-400">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="hover:text-amber-400">
              Terms &amp; Conditions
            </Link>
            <a href="http://localhost:5174" target="_blank" rel="noopener noreferrer" className="text-orange-400 font-bold hover:underline">
              Admin Portal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
