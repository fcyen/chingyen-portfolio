import postcssOklabFunction from "@csstools/postcss-oklab-function";

/*
 * Emit sRGB fallbacks for oklch()/oklab() so browsers older than mid-2023
 * (pre-Chrome 111, pre-Firefox 113) still get usable colors. `preserve: true`
 * keeps the original oklch() declaration alongside the fallback, so modern
 * browsers continue to render the wide-gamut value.
 */
export default {
  plugins: [postcssOklabFunction({ preserve: true })],
};
