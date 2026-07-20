# Reagan Hu — Portfolio

A one-page personal digital exhibition built with Next.js and TypeScript. Its single visual motif is the **threshold window**: an architectural frame that becomes landscape viewport, system diagram, project media surface, and navigation device.

## Visual direction

Three directions were considered:

1. **Threshold Window** — architectural apertures connect landscape depth and technical systems. Chosen for its clarity, flexibility, and direct relationship to the engineering idea of crossing system boundaries.
2. **Unrolled Field Notes** — one continuous annotated scroll.
3. **Folding Screen** — modular panels expanding into case studies.

The chosen direction now uses contemporary liquid-ink diffusion, cool off-white space, precise technical grids, generous negative space, and one muted vermilion accent. Ink is structural rather than decorative: it forms the hero field, bleeds across section boundaries, pools behind editorial headings, and becomes a gestural divider around experience and project content.

The page sequence prioritizes the person behind the work: hero → short orientation → portrait and About → scannable experience → selected project stories → process → notebook → contact.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Production checks:

```bash
npm run typecheck
npm run build
```

## Update content

All projects, experience items, and notebook entries live in `content/site.ts`. Edit the arrays there without changing page layout code.

- Add a project to `projects` and choose one of the current diagram treatments: `manipulation`, `rover`, or `social`.
- Add notebook entries to `notes`. This local source can later be replaced by MDX, Notion, or a lightweight CMS.
- Add résumé items to `experience`.
- Search the repository for `[PLACEHOLDER` and `[ADD LINK]` before launch.

## Replace images

The hero visual is generated entirely in CSS so it stays crisp, responsive, and lightweight. The About portrait is the unmodified personal photograph at `public/images/reagan-horizon-original.jpg`; it is connected to the ink motif only through non-destructive CSS framing and color treatment. The same photograph is used for Open Graph metadata in `app/layout.tsx`.

Next.js handles responsive optimization and art-directed cropping through each image's `sizes` and CSS `object-position` settings.

## Résumé and links

Place the final PDF at `public/Reagan-Hu-Resume.pdf`. Replace the placeholder email, GitHub, and LinkedIn URLs in `app/page.tsx`.

## Deploy

Push the folder to a Git repository and import it into Vercel, or run `npm run build` on any host that supports Node.js. Update `metadataBase`, sitemap, and robots URLs in `app/layout.tsx`, `app/sitemap.ts`, and `app/robots.ts` when the final domain is known.

## Accessibility and motion

The site uses semantic headings, visible keyboard focus, descriptive image text, accessible contrast, and a real mobile navigation control. All reveal, cursor, scan-line, and parallax-like motion is disabled when `prefers-reduced-motion: reduce` is enabled.

## Generated artwork

Created with the built-in image generation workflow using the `stylized-concept` prompt described in the project handoff. No stock imagery or external runtime dependency is used.
