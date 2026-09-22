// A CSS `dashed` border lets each browser pick its own dash length, and it
// can't be tuned. This draws the border as a masked layer instead, so every
// dashed box in the app gets the same dash and gap and still follows rounded
// corners. The colour stays a CSS variable, so it follows the theme.

type DashedBorderOptions = {
  color?: string;
  // must match the element's corner radius, in px
  radius?: number;
  dash?: number;
  gap?: number;
  width?: number;
};

const DASHED_BORDER_DEFAULTS = {
  color: 'var(--accent-300)',
  radius: 12,
  dash: 8,
  gap: 8,
  width: 1,
};

const dashedBorder = (options: DashedBorderOptions = {}) => {
  const { color, radius, dash, gap, width } = {
    ...DASHED_BORDER_DEFAULTS,
    ...options,
  };

  // the stroke is centred on the rect's edge, so half of it is clipped away:
  // doubling it leaves the requested width inside the box
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><rect width='100%' height='100%' rx='${radius}' ry='${radius}' fill='none' stroke='black' stroke-width='${width * 2}' stroke-dasharray='${dash} ${gap}'/></svg>`;

  const mask = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

  return {
    position: 'relative',
    borderRadius: `${radius}px`,
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: 'inherit',
      backgroundColor: color,
      mask,
      WebkitMask: mask,
      pointerEvents: 'none',
    },
  } as const;
};

export default dashedBorder;
