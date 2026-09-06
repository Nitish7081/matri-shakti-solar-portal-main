import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageHero, Section } from "@/components/shared/Section";
import { MapPin, Zap, Building2 } from "lucide-react";
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
          "Explore rooftop solar installations by Matri Shakti Infrastructure — residential, commercial and agricultural projects.",
      },
      { property: "og:title", content: "Solar Installation Gallery" },
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
  src: string;
}

const fallbackImages: IGalleryItem[] = [
  { src: g1, title: "5 KW Residential Rooftop", location: "Paniyara, Maharajganj", capacityKW: 5, companyName: "Tata Power Solar" },
  { src: g2, title: "10 KW Commercial Building", location: "Civil Lines, Gorakhpur", capacityKW: 10, companyName: "Adani Solar" },
  { src: g3, title: "Mono PERC Bifacial Panels", location: "Golghar, Gorakhpur", capacityKW: 3, companyName: "Waaree Solar" },
  { src: g4, title: "Happy Empowered Family", location: "Pharenda, Maharajganj", capacityKW: 4, companyName: "Tata Power Solar" },
  { src: g5, title: "Solar Water Pump System", location: "Campierganj, Gorakhpur", capacityKW: 7, companyName: "Loom Solar" },
  { src: g6, title: "Engineer Quality Inspection", location: "Naugarh, Siddharthnagar", capacityKW: 8, companyName: "Vikram Solar" },
];

function GalleryPage() {
  const [items, setItems] = useState<IGalleryItem[]>(fallbackImages);

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
              let resolvedSrc = rawImg;
              if (rawImg === "/gallery-1.jpg") resolvedSrc = g1;
              else if (rawImg === "/gallery-2.jpg") resolvedSrc = g2;
              else if (rawImg === "/gallery-3.jpg") resolvedSrc = g3;
              else if (!rawImg) resolvedSrc = fallbackImages[idx % fallbackImages.length].src;

              return {
                id: inst._id || inst.id,
                title: inst.title,
                location: inst.location ? `${inst.location}, ${inst.city}` : inst.city,
                city: inst.city,
                companyName: inst.companyName,
                capacityKW: inst.capacityKW,
                src: resolvedSrc,
              };
            });
            setItems(mapped);
          }
        }
      } catch {
        // preserve fallback items
      }
    }
    loadInstallations();
  }, [baseUrl]);

  return (
    <>
      <PageHero
        eyebrow="Our Installations & Projects"
        title="Solar Installation Gallery"
        description="A glimpse of the rooftops we have powered — clean, safe, and beautifully engineered across Uttar Pradesh."
      />
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((img, i) => (
            <motion.figure
              key={img.id || img.title + i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-2xl shadow-card bg-card border border-border/60 flex flex-col"
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

                {img.capacityKW && (
                  <div className="absolute top-3 left-3 bg-secondary/90 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5 text-primary-glow fill-current" />
                    {img.capacityKW} KW System
                  </div>
                )}
              </div>

              <figcaption className="p-4 bg-card flex-1 flex flex-col justify-between">
                <div>
                  <div className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {img.title}
                  </div>

                  {img.location && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
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
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Section>
    </>
  );
}
