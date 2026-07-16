import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { X } from "lucide-react";
import { fetchGallery } from "@/lib/gallery";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — VJ Generation" },
      { name: "description", content: "A curated gallery of weddings, events and productions captured by VJ Generation." },
      { property: "og:title", content: "Gallery — VJ Generation" },
      { property: "og:description", content: "Explore memories captured by VJ Generation." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { data, isLoading } = useQuery({ queryKey: ["gallery"], queryFn: fetchGallery });
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <div className="text-gold uppercase text-xs tracking-[0.4em] mb-3">The gallery</div>
        <h1 className="text-4xl sm:text-6xl font-bold">Moments, framed.</h1>
        <p className="text-muted-foreground mt-4">A living archive of the memories we've had the honor to create.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square bg-muted animate-pulse rounded" />
          ))}
        </div>
      ) : (data?.length ?? 0) === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-xl">
          <p className="text-muted-foreground mb-4">The gallery is being curated.</p>
          <Link to="/submit" className="text-gold hover:underline">Have a picture from an event? Submit it →</Link>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {data!.map((img) => (
            <button
              key={img.id}
              onClick={() => setLightbox(img.url)}
              className="frame-gold block w-full break-inside-avoid overflow-hidden mb-4"
            >
              <img
                src={img.url}
                alt={img.caption ?? ""}
                className="w-full h-auto object-cover hover:scale-105 transition duration-700"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-6 right-6 text-gold" aria-label="Close">
            <X size={28} />
          </button>
          <img src={lightbox} alt="" className="max-h-full max-w-full rounded" />
        </div>
      )}
    </div>
  );
}