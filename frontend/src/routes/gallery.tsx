import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHero, Section } from "@/components/shared/Section";
import { MapPin, Zap, Building2, Calendar, X, Eye, ShieldCheck } from "lucide-react";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Solar Installations by Matri Shakti" },
      {
        name: "description",
        content:
          "Explore rooftop solar installations by Matri Shakti Infrastructure — residential, commercial and agricultural projects across Uttar Pradesh.",
      },
      { property: "og:title", content: "Solar Installation Gallery — Matri Shakti" },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

interface IGalleryItem {
  id?: string;
  _id?: string;
  title: string;
  location?: string;
  city?: string;
  companyName?: string;
  capacityKW?: number;
  installationDate?: string;
  description?: string;
  src: string;
  isLiveUpload?: boolean;
}

const fallbackImages: IGalleryItem[] = [
  { src: g1, title: "5 KW Residential Rooftop", location: "Paniyara, Maharajganj", city: "Maharajganj", capacityKW: 5, companyName: "Tata Power Solar", installationDate: "2026-01-15" },
  { src: g2, title: "10 KW Commercial Building", location: "Civil Lines, Gorakhpur", city: "Gorakhpur", capacityKW: 10, companyName: "Adani Solar", installationDate: "2026-02-10" },
  { src: g3, title: "Mono PERC Bifacial Panels", location: "Golghar, Gorakhpur", city: "Gorakhpur", capacityKW: 3, companyName: "Waaree Solar", installationDate: "2026-02-20" },
  { src: g4, title: "Residential Solar System", location: "Pharenda, Maharajganj", city: "Maharajganj", capacityKW: 4, companyName: "Tata Power Solar", installationDate: "2026-01-28" },
  { src: g5, title: "Solar Water Pump System", location: "Campierganj, Gorakhpur", city: "Gorakhpur", capacityKW: 7, companyName: "Loom Solar", installationDate: "2026-02-05" },
  { src: g6, title: "Commercial Grid Solar Plant", location: "Naugarh, Siddharthnagar", city: "Siddharthnagar", capacityKW: 8, companyName: "Vikram Solar", installationDate: "2026-02-18" },
];

function resolveImageSrc(rawImg: string, fallbackIdx: number): string {
  if (!rawImg) return fallbackImages[fallbackIdx % fallbackImages.length].src;
  if (rawImg === "/gallery-1.jpg") return g1;
  if (rawImg === "/gallery-2.jpg") return g2;
  if (rawImg === "/gallery-3.jpg") return g3;
  if (rawImg === "/gallery-4.jpg") return g4;
  if (rawImg === "/gallery-5.jpg") return g5;
  if (rawImg === "/gallery-6.jpg") return g6;
  return rawImg;
}

function GalleryPage() {
  const [items, setItems] = useState<IGalleryItem[]>(fallbackImages);
  const [selectedItem, setSelectedItem] = useState<IGalleryItem | null>(null);
  const [hasUploadedItems, setHasUploadedItems] = useState(false);

  const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  useEffect(() => {
    async function loadInstallations() {
      try {
        const res = await fetch(`${baseUrl}/api/installations`);
        if (res.ok) {
          const data = await res.json();
          if (data.installations && data.installations.length > 0) {
            const mapped: IGalleryItem[] = data.installations.map((inst: any, idx: number) => {
              const rawImg = inst.images && inst.images.length > 0 ? inst.images[0] : "";
              return {
                id: inst._id || inst.id,
                title: inst.title,
                location: inst.location ? `${inst.location}, ${inst.city}` : inst.city,
                city: inst.city,
                companyName: inst.companyName,
                capacityKW: inst.capacityKW,
                installationDate: inst.installationDate,
                description: inst.description,
                src: resolveImageSrc(rawImg, idx),
                isLiveUpload: true,
              };
            });
            setItems(mapped);
            setHasUploadedItems(true);
          }
        }
      } catch {
        // Fallback to showcase items
      }
    }
    loadInstallations();
  }, [baseUrl]);

  return (
    <>
      <PageHero
        eyebrow="Our Installations & Projects"
        title="Solar Installation Gallery"
        description="A glimpse of the rooftops we have powered across Uttar Pradesh — engineered for maximum generation, zero-carbon future, and lifetime savings."
      />

      <Section>
        {hasUploadedItems && (
          <div className="mb-6 flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Showing live verified installation photos updated from Matri Shakti Admin Panel
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              {items.length} Project{items.length > 1 ? "s" : ""}
            </span>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((img, i) => (
            <motion.figure
              key={img.id || img.title + i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedItem(img)}
              className="group relative overflow-hidden rounded-2xl shadow-card bg-card border border-border/60 flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                <img
                  src={img.src}
                  alt={img.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  width={1200}
                  height={900}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = g1;
                  }}
                />

                {/* Capacity badge */}
                {img.capacityKW && (
                  <div className="absolute top-3 left-3 bg-secondary/90 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5 text-primary-glow fill-current" />
                    {img.capacityKW} KW System
                  </div>
                )}

                {/* Live upload badge */}
                {img.isLiveUpload && (
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </div>
                )}

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5 backdrop-blur-xs">
                  <Eye className="h-4 w-4" /> View Full Details
                </div>
              </div>

              <figcaption className="p-4 bg-card flex-1 flex flex-col justify-between">
                <div>
                  <div className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {img.title}
                  </div>

                  {img.location && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{img.location}</span>
                    </div>
                  )}

                  {img.companyName && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{img.companyName}</span>
                    </div>
                  )}
                </div>

                {img.installationDate && (
                  <div className="pt-3 mt-3 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Commissioned
                    </span>
                    <span className="font-medium text-foreground">{img.installationDate}</span>
                  </div>
                )}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Section>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card text-card-foreground rounded-2xl overflow-hidden shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-border"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] w-full bg-black overflow-hidden">
                <img
                  src={selectedItem.src}
                  alt={selectedItem.title}
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white p-2 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Details Content */}
              <div className="p-6 overflow-y-auto space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-bold font-display text-foreground">{selectedItem.title}</h2>
                    {selectedItem.location && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                        <MapPin className="h-4 w-4 text-primary" />
                        {selectedItem.location}
                      </p>
                    )}
                  </div>

                  {selectedItem.capacityKW && (
                    <span className="bg-primary text-white font-bold text-sm px-3 py-1 rounded-lg shadow-sm flex items-center gap-1">
                      <Zap className="h-4 w-4 fill-current" />
                      {selectedItem.capacityKW} KW Rooftop Solar
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-muted/40 rounded-xl border border-border text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Brand / Technology</span>
                    <span className="font-semibold text-foreground mt-0.5 block">{selectedItem.companyName || "Tata Power Solar"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">District / Location</span>
                    <span className="font-semibold text-foreground mt-0.5 block">{selectedItem.city || "Maharajganj"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Commissioning Date</span>
                    <span className="font-semibold text-foreground mt-0.5 block">{selectedItem.installationDate || "Verified"}</span>
                  </div>
                </div>

                {selectedItem.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed bg-muted/20 p-3 rounded-lg border border-border/50">
                    {selectedItem.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
