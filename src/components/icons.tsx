/*
 * Pixel-art weapon icons + small UI glyphs.
 * Ported from design-reference/project/src/icons.jsx.
 *
 * Pixel icons use PixelGrid (SVG rects); the rest are inline SVGs.
 */
import PixelGrid from "@/components/PixelGrid";

type WeaponIconProps = { scale?: number };

export const LaptopIcon = ({ scale = 4 }: WeaponIconProps) => (
  <PixelGrid
    scale={scale}
    color="var(--ink)"
    rows={[
      "............",
      "..########..",
      "..#kkkkkk#..",
      "..#kkkkkk#..",
      "..#kkkkkk#..",
      "..#kkkkkk#..",
      "..########..",
      ".##########.",
      "############",
      "............",
    ]}
  />
);

export const StickyIcon = ({ scale = 4 }: WeaponIconProps) => (
  <PixelGrid
    scale={scale}
    color="var(--ink)"
    rows={[
      "..........",
      ".yyyyyyyy.",
      ".yyyyyyyy.",
      ".y#####yy.",
      ".yyyyyyyy.",
      ".y####yyy.",
      ".yyyyyyyy.",
      ".y######y.",
      ".yyyyyyyy.",
      "..........",
    ]}
  />
);

export const CameraIcon = ({ scale = 4 }: WeaponIconProps) => (
  <PixelGrid
    scale={scale}
    color="var(--ink)"
    rows={[
      "....####....",
      "############",
      "############",
      "###k####k###",
      "###kk##kk###",
      "###k####k###",
      "############",
      "############",
      "############",
      "............",
    ]}
  />
);

type GlyphProps = { size?: number };

export const ArrowSE = ({ size = 12 }: GlyphProps) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M2 10 L10 2 M5 2 H10 V7" />
  </svg>
);

export const ArrowR = ({ size = 12 }: GlyphProps) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M2 6 H10 M7 3 L10 6 L7 9" />
  </svg>
);

export const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v15H.22V8zm7.59 0h4.37v2.05h.06c.61-1.16 2.1-2.39 4.32-2.39 4.62 0 5.47 3.04 5.47 7v8.34h-4.56v-7.4c0-1.77-.03-4.05-2.47-4.05-2.47 0-2.85 1.93-2.85 3.92V23H7.81V8z" />
  </svg>
);

export const GithubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.9-.39.99 0 1.98.13 2.9.39 2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.68.8.56 4.56-1.52 7.84-5.83 7.84-10.9C23.5 5.65 18.35.5 12 .5z" />
  </svg>
);

export const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <rect x="2" y="5" width="20" height="14" rx="1" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);

export const PixelHeart = ({ scale = 3 }: WeaponIconProps) => (
  <PixelGrid
    scale={scale}
    color="var(--accent)"
    rows={[
      ".##.##.",
      "#######",
      "#######",
      ".#####.",
      "..###..",
      "...#...",
    ]}
  />
);

export const LockIcon = ({ size = 12 }: GlyphProps) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <rect x="2" y="6" width="8" height="5" />
    <path d="M4 6 V4.2 a2 2 0 0 1 4 0 V6" />
  </svg>
);
