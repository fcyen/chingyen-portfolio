import type { CSSProperties, ReactElement } from "react";

/*
 * PixelGrid — render a string-grid of pixels as crisp SVG rects.
 *
 * Each row is a string; one character per pixel. Recognised characters:
 *   "."/" " — empty
 *   "#"     — `color` (defaults to currentColor)
 *   "k"     — var(--ink)
 *   "o"     — var(--accent)
 *   "l"     — light cream (oklch(0.85 0.02 80))
 *   "y"     — sticky-note yellow (oklch(0.85 0.10 90))
 *
 * Ported from design-reference/project/src/icons.jsx.
 */
export type PixelGridProps = {
  rows: string[];
  scale?: number;
  color?: string;
  bg?: string;
  style?: CSSProperties;
};

const CHAR_COLORS: Record<string, string> = {
  k: "var(--ink)",
  o: "var(--accent)",
  l: "oklch(0.85 0.02 80)",
  y: "oklch(0.85 0.10 90)",
};

export default function PixelGrid({
  rows,
  scale = 4,
  color = "currentColor",
  bg = "transparent",
  style,
}: PixelGridProps) {
  const cols = rows[0]?.length ?? 0;
  const w = cols * scale;
  const h = rows.length * scale;

  const cells: ReactElement[] = [];
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === "." || ch === " ") continue;
      const fill = ch === "#" ? color : (CHAR_COLORS[ch] ?? color);
      cells.push(
        <rect
          key={`${x},${y}`}
          x={x * scale}
          y={y * scale}
          width={scale}
          height={scale}
          fill={fill}
        />,
      );
    }
  });

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      style={{
        display: "block",
        imageRendering: "pixelated",
        background: bg,
        ...style,
      }}
    >
      {cells}
    </svg>
  );
}
