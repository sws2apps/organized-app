import { useAppTranslation } from '@hooks/index';
import { ReactNode, Ref, useLayoutEffect, useRef, useState } from 'react';
import { Box, ButtonBase, Stack } from '@mui/material';
import { Typography } from '@components/index';
import { Bucket } from '@features/territories/map/views';

const Dot = ({ color }: { color: string }) => (
  <Box
    component="span"
    sx={{
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      flexShrink: 0,
      // theme colours come as variables, fixed map colours as values
      backgroundColor: color.startsWith('--') ? `var(${color})` : color,
    }}
  />
);

const Entry = ({ item }: { item: Bucket }) => {
  const { t } = useAppTranslation();
  return (
    <Stack direction="row" sx={{ alignItems: 'center', gap: '6px' }}>
      <Dot color={item.color} />
      <Typography
        className="label-small-regular"
        color="var(--grey-400)"
        sx={{ whiteSpace: 'nowrap' }}
      >
        {t(item.label)}
      </Typography>
    </Stack>
  );
};

const MapLegend = ({ items }: { items: Bucket[] }) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px' }}>
    {items.map((item) => (
      <Entry key={item.key} item={item} />
    ))}
  </Box>
);

const EASE = 'cubic-bezier(0.2, 0, 0, 1)';
const PAD = 10;

type Size = { width: number; height: number };

const sizeOf = (node: HTMLElement | null): Size | undefined =>
  node ? { width: node.offsetWidth, height: node.offsetHeight } : undefined;

// both faces stay mounted, so the box can grow from the one to the other
const Face = ({
  shown,
  faceRef,
  children,
}: {
  shown: boolean;
  faceRef: Ref<HTMLDivElement>;
  children: ReactNode;
}) => (
  <Box
    ref={faceRef}
    aria-hidden={!shown}
    sx={{
      position: 'absolute',
      left: PAD,
      bottom: PAD,
      opacity: shown ? 1 : 0,
      transform: shown ? 'none' : 'scale(0.96)',
      transformOrigin: 'bottom left',
      // the leaving face goes first, the coming one follows
      transition: shown
        ? `opacity 180ms ${EASE} 90ms, transform 260ms ${EASE}`
        : `opacity 120ms ${EASE}, transform 260ms ${EASE}`,
    }}
  >
    {children}
  </Box>
);

// on a phone it stays folded into its dots until tapped, so it leaves the territories free
export const LegendIsland = ({
  items,
  defaultOpen = false,
}: {
  items: Bucket[];
  defaultOpen?: boolean;
}) => {
  const { t } = useAppTranslation();

  const [open, setOpen] = useState(defaultOpen);
  const foldedRef = useRef<HTMLDivElement>(null);
  const fullRef = useRef<HTMLDivElement>(null);
  const [sizes, setSizes] = useState<{ folded?: Size; full?: Size }>({});

  useLayoutEffect(() => {
    const measure = () =>
      setSizes({
        folded: sizeOf(foldedRef.current),
        full: sizeOf(fullRef.current),
      });
    measure();
    // the labels change with the language and the font
    const observer = new ResizeObserver(measure);
    [foldedRef.current, fullRef.current].forEach(
      (node) => node && observer.observe(node)
    );
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  const size = open ? sizes.full : sizes.folded;

  return (
    <ButtonBase
      disableRipple
      aria-expanded={open}
      aria-label={
        open ? t('tr_territoryHideTheLegend') : t('tr_territoryShowTheLegend')
      }
      onClick={() => setOpen(!open)}
      sx={{
        position: 'relative',
        display: 'block',
        overflow: 'hidden',
        width: size ? size.width + 2 * PAD : undefined,
        height: size ? size.height + 2 * PAD : undefined,
        borderRadius: 'var(--radius-l)',
        backgroundColor: 'var(--white)',
        border: '1px solid var(--accent-200)',
        boxShadow: 'var(--hover-shadow)',
        transition: `width 260ms ${EASE}, height 260ms ${EASE}`,
        '&:focus-visible': { outline: 'var(--accent-main) auto 1px' },
        '@media (prefers-reduced-motion: reduce)': {
          '&, & *': { transition: 'none !important' },
        },
      }}
    >
      <Face shown={!open} faceRef={foldedRef}>
        <Stack direction="row" sx={{ gap: '4px' }}>
          {items.map((item) => (
            <Dot key={item.key} color={item.color} />
          ))}
        </Stack>
      </Face>
      <Face shown={open} faceRef={fullRef}>
        <Stack sx={{ gap: '4px', alignItems: 'flex-start' }}>
          {items.map((item) => (
            <Entry key={item.key} item={item} />
          ))}
        </Stack>
      </Face>
    </ButtonBase>
  );
};

export default MapLegend;
