"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const photos = [
  { src: "/images/gallery/xian-bell-tower.jpg", alt: "The illuminated Bell Tower of Xi'an against a deep blue night sky", place: "Xi'an, China", number: "01", width: 2048, height: 1152 },
  { src: "/images/gallery/horseshoe-bend.jpg", alt: "The Colorado River curving around Horseshoe Bend", place: "Horseshoe Bend, Arizona", number: "02", width: 1812, height: 1280 },
  { src: "/images/gallery/pacific-sunset.jpg", alt: "A quiet bay in Nanaimo reflecting the orange glow of sunset", place: "Nanaimo, BC", number: "03", width: 1196, height: 672 },
  { src: "/images/gallery/malibu-coast.jpg", alt: "A view over a rugged Malibu cliff and the blue Pacific Ocean", place: "Malibu, California", number: "04", width: 1368, height: 1824 },
] as const;

export default function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active === null && dialog.open) dialog.close();
    if (active !== null && !dialog.open) dialog.showModal();
  }, [active]);

  const move = (direction: -1 | 1) => {
    setActive((current) => current === null ? 0 : (current + direction + photos.length) % photos.length);
  };

  return (
    <>
      <div className="gallery-grid">
        {photos.map((photo, index) => (
          <figure className={`gallery-photo gallery-photo-${index + 1}`} key={photo.src}>
            <button type="button" onClick={() => setActive(index)} aria-label={`Open photo: ${photo.place}`}>
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 880px) 45vw, 28vw" />
              <span className="gallery-open" aria-hidden="true">View</span>
            </button>
            <figcaption><span>{photo.number}</span>{photo.place}</figcaption>
          </figure>
        ))}
      </div>

      <dialog
        className="lightbox"
        ref={dialogRef}
        onClose={() => setActive(null)}
        onClick={(event) => { if (event.target === event.currentTarget) setActive(null); }}
      >
        {active !== null && (
          <div className="lightbox-inner">
            <Image src={photos[active].src} alt={photos[active].alt} width={photos[active].width} height={photos[active].height} sizes="95vw" priority />
            <p><span>{photos[active].number} / 04</span>{photos[active].place}</p>
            <button className="lightbox-close" type="button" onClick={() => setActive(null)} aria-label="Close gallery">Close</button>
            <button className="lightbox-prev" type="button" onClick={() => move(-1)} aria-label="Previous photo">←</button>
            <button className="lightbox-next" type="button" onClick={() => move(1)} aria-label="Next photo">→</button>
          </div>
        )}
      </dialog>
    </>
  );
}
