import AppIconButton from '@components/icon_button';
import { useAppTranslation } from '@hooks/index';
import {
  cloneElement,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import * as maplibregl from 'maplibre-gl';
import { Box, ButtonBase, Menu, MenuItem, Popover, Stack } from '@mui/material';
import { Button, CustomDivider, Typography } from '@components/index';
import Tooltip from '@components/tooltip';
import {
  IconActivityZone,
  IconMapAdd,
  IconAddPin,
  IconCheck,
  IconCropFree,
  IconClose,
  IconContentCut,
  IconDashedLine,
  IconDelete,
  IconDrawLine,
  IconDrawShape,
  IconEdit,
  IconFrameInspect,
  IconCellMerge,
  IconMoveAround,
  IconRedo,
  IconPolyline,
  IconSolidLine,
  IconTypeText,
  IconUndo,
} from '@icons/index';
import { MapColor, PinType } from '@definition/territory';
import {
  MAP_COLOR_LABEL,
  MAP_COLORS,
  PIN_TYPES,
} from '@features/territories/map/constants';
import PinIcon from '@features/territories/map/pin_icon';
import useMapEditor, {
  MapItemKind,
  MapTool,
} from '@features/territories/map/useMapEditor';

type Editor = ReturnType<typeof useMapEditor>;

const COLORS = Object.keys(MAP_COLORS) as MapColor[];

const SHELL = {
  backgroundColor: 'var(--white)',
  border: '1px solid var(--accent-200)',
  borderRadius: 'var(--radius-l)',
  boxShadow: 'var(--hover-shadow)',
  padding: '4px',
  gap: '2px',
  alignItems: 'center',
};

const IconButton = ({
  label,
  icon,
  active,
  disabled = false,
  danger = false,
  placement = 'right',
  tool,
  onClick,
}: {
  // marks a rail button, so a tool's options can open beside it
  tool?: string;
  label: string;
  icon: ReactElement<{ color?: string }>;
  active?: boolean;
  disabled?: boolean;
  danger?: boolean;
  placement?: 'right' | 'top' | 'bottom';
  onClick: VoidFunction;
}) => {
  let color = active ? 'var(--accent-dark)' : 'var(--accent-main)';
  if (danger) color = 'var(--red-main)';
  if (disabled) color = 'var(--grey-300)';

  return (
    <Tooltip title={label} placement={placement} delaySpeed="fast">
      <span>
        <AppIconButton
          disableRipple
          disabled={disabled}
          aria-label={label}
          aria-pressed={active}
          data-tool={tool}
          onClick={onClick}
          sx={{
            margin: 0,
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-m)',
            backgroundColor: active ? 'var(--accent-150)' : 'transparent',
            transition:
              'background-color var(--motion-fast) var(--ease-standard)',
            '@media (pointer: coarse)': { width: '44px', height: '44px' },
            '&:hover': {
              backgroundColor: danger
                ? 'var(--red-secondary)'
                : 'var(--accent-100)',
            },
            '&:focus-visible': { outline: 'var(--accent-main) auto 1px' },
          }}
        >
          {cloneElement(icon, { color })}
        </AppIconButton>
      </span>
    </Tooltip>
  );
};

const Divider = ({ vertical }: { vertical: boolean }) => (
  <CustomDivider
    orientation={vertical ? 'horizontal' : 'vertical'}
    flexItem
    color="var(--accent-200)"
    // with the bar's 2px gap, 8px of space on each side of a line across
    sx={vertical ? { margin: '2px 6px' } : { margin: '6px 6px' }}
  />
);

// edit mode before anything is picked: the same rail, with what can start
// from here; picking a territory swaps in its drawing tools
export const IdleRail = ({
  onNewTerritory,
  onCongregation,
  checking,
  onCheck,
}: {
  onNewTerritory: VoidFunction;
  onCongregation: VoidFunction;
  checking: boolean;
  onCheck: VoidFunction;
}) => {
  const { t } = useAppTranslation();
  return (
    <Stack direction="column" sx={SHELL}>
      <IconButton
        label={t('tr_territoryMoveTheMap')}
        icon={<IconMoveAround />}
        active
        onClick={() => undefined}
      />
      <Divider vertical />
      <IconButton
        label={t('tr_territoryNewMap')}
        icon={<IconMapAdd />}
        onClick={onNewTerritory}
      />
      <IconButton
        label={t('tr_territoryCongregationArea')}
        icon={<IconCropFree />}
        onClick={onCongregation}
      />
      <Divider vertical />
      <IconButton
        label={t('tr_territoryGapsAndOverlaps')}
        icon={<IconFrameInspect />}
        active={checking}
        onClick={onCheck}
      />
    </Stack>
  );
};

// the tools, Figma-like: down the left on a wide screen, along the bottom on a phone
export const EditRail = ({
  editor,
  vertical,
}: {
  editor: Editor;
  vertical: boolean;
}) => {
  const { t } = useAppTranslation();

  const congregation = editor.scope === 'congregation';
  const hasBorder = !!editor.draft.boundary?.length;
  const placement = vertical ? 'right' : 'top';

  const tool = (
    key: MapTool,
    label: string,
    icon: ReactElement<{ color?: string }>,
    onClick = () => editor.pickTool(key)
  ) => (
    <IconButton
      key={key}
      label={label}
      icon={icon}
      placement={placement}
      active={editor.tool === key}
      disabled={!hasBorder}
      tool={key}
      onClick={onClick}
    />
  );

  return (
    <Stack direction={vertical ? 'column' : 'row'} sx={SHELL}>
      {hasBorder ? (
        <>
          {tool('move', t('tr_territoryMoveItems'), <IconMoveAround />)}
          {tool(
            'points',
            t('tr_territoryAdjustPoints'),
            <IconPolyline />,
            editor.adjustBorder
          )}
        </>
      ) : (
        <IconButton
          label={t('tr_territoryBorder')}
          icon={<IconDrawShape />}
          placement={placement}
          active
          onClick={() => editor.pickTool('border')}
        />
      )}

      {!congregation && (
        <>
          <Divider vertical={vertical} />
          {tool('shape', t('tr_territoryArea'), <IconActivityZone />)}
          {tool('line', t('tr_territoryLine'), <IconDrawLine />)}
          {tool('pin', t('tr_territoryPin'), <IconAddPin />)}
          {tool('text', t('tr_territoryText'), <IconTypeText />)}
          <Divider vertical={vertical} />
          {tool('split', t('tr_territorySplit'), <IconContentCut />)}
          {tool('merge', t('tr_territoryCombine'), <IconCellMerge />)}
        </>
      )}

      <Divider vertical={vertical} />
      <IconButton
        label={t('tr_territoryUndo')}
        icon={<IconUndo />}
        placement={placement}
        onClick={editor.undo}
      />
      <IconButton
        label={t('tr_territoryRedo')}
        icon={<IconRedo />}
        placement={placement}
        onClick={editor.redo}
      />
    </Stack>
  );
};

const Swatch = ({
  color,
  size = 16,
}: {
  color: MapColor | 'transparent';
  size?: number;
}) => (
  <Box
    sx={{
      width: `${size}px`,
      height: `${size}px`,
      flexShrink: 0,
      borderRadius: 'var(--radius-max)',
      border: '1px solid var(--accent-200)',
      background:
        color === 'transparent'
          ? 'linear-gradient(135deg, transparent 45%, var(--grey-300) 45%, var(--grey-300) 55%, transparent 55%)'
          : MAP_COLORS[color],
    }}
  />
);

// one round button showing the colour; the choices open under it
const ColorPicker = ({
  label,
  value,
  allowNone,
  onPick,
}: {
  label: string;
  value: MapColor | 'transparent';
  allowNone: boolean;
  onPick: (color: MapColor | 'transparent') => void;
}) => {
  const { t } = useAppTranslation();

  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const choices = allowNone ? (['transparent', ...COLORS] as const) : COLORS;

  return (
    <>
      <Tooltip title={label} placement="top" delaySpeed="fast">
        <ButtonBase
          disableRipple
          aria-label={label}
          aria-haspopup="true"
          onClick={(event) => setAnchor(event.currentTarget)}
          sx={{
            gap: '6px',
            height: '36px',
            padding: '0 8px',
            borderRadius: 'var(--radius-m)',
            '&:hover': { backgroundColor: 'var(--accent-100)' },
          }}
        >
          <Swatch color={value} size={18} />
          <Typography className="label-small-medium" color="var(--grey-400)">
            {label}
          </Typography>
        </ButtonBase>
      </Tooltip>
      <Popover
        open={!!anchor}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        slotProps={{
          // the same surface as the bars it opens from, in either theme
          paper: {
            sx: {
              ...SHELL,
              marginTop: '6px',
              display: 'flex',
              backgroundImage: 'none',
            },
          },
        }}
      >
        {choices.map((color) => (
          <Tooltip
            key={color}
            title={
              color === 'transparent' ? t('tr_none') : t(MAP_COLOR_LABEL[color])
            }
            placement="bottom"
            delaySpeed="fast"
          >
            <ButtonBase
              disableRipple
              aria-label={
                color === 'transparent'
                  ? t('tr_none')
                  : t(MAP_COLOR_LABEL[color])
              }
              aria-pressed={value === color}
              onClick={() => {
                onPick(color);
                setAnchor(null);
              }}
              sx={{
                padding: '5px',
                borderRadius: 'var(--radius-max)',
                outline:
                  value === color ? '2px solid var(--accent-main)' : 'none',
                '&:hover': { backgroundColor: 'var(--accent-100)' },
              }}
            >
              <Swatch color={color} size={20} />
            </ButtonBase>
          </Tooltip>
        ))}
      </Popover>
    </>
  );
};

const DashToggle = ({
  dashed,
  onPick,
}: {
  dashed: boolean;
  onPick: (dashed: boolean) => void;
}) => {
  const { t } = useAppTranslation();
  return (
    <>
      <IconButton
        label={t('tr_territorySolid')}
        icon={<IconSolidLine />}
        placement="top"
        active={!dashed}
        onClick={() => onPick(false)}
      />
      <IconButton
        label={t('tr_territoryDashed')}
        icon={<IconDashedLine />}
        placement="top"
        active={dashed}
        onClick={() => onPick(true)}
      />
    </>
  );
};

const PinTypes = ({
  value,
  onPick,
}: {
  value: PinType;
  onPick: (type: PinType) => void;
}) => {
  const { t } = useAppTranslation();
  return (
    <>
      {PIN_TYPES.map((item) => (
        <Tooltip
          key={item.id}
          title={t(item.label)}
          placement="top"
          delaySpeed="fast"
        >
          <ButtonBase
            disableRipple
            aria-label={t(item.label)}
            aria-pressed={value === item.id}
            onClick={() => onPick(item.id)}
            sx={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-m)',
              backgroundColor:
                value === item.id ? 'var(--accent-150)' : 'transparent',
              '&:hover': { backgroundColor: 'var(--accent-100)' },
            }}
          >
            <PinIcon
              type={item.id}
              color={
                value === item.id ? 'var(--accent-dark)' : 'var(--grey-400)'
              }
              size={18}
            />
          </ButtonBase>
        </Tooltip>
      ))}
    </>
  );
};

// the pin types for the next pin, with their names, beside the pin tool
const PinFlyout = ({
  editor,
  map,
}: {
  editor: Editor;
  map?: maplibregl.Map | null;
}) => {
  const { t } = useAppTranslation();

  const [spot, setSpot] = useState<{ top: number; left: number }>();

  useEffect(() => {
    const wrapper = map?.getContainer().parentElement;
    const button = wrapper?.querySelector('[data-tool="pin"]');
    if (!wrapper || !button) return setSpot(undefined);
    const place = () => {
      const box = wrapper.getBoundingClientRect();
      const at = button.getBoundingClientRect();
      // level with the pin tool, just right of the rail
      setSpot({ top: at.top - box.top - 4, left: at.right - box.left + 14 });
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [map]);

  if (!spot) return null;

  return (
    <Box
      sx={{
        ...SHELL,
        position: 'absolute',
        zIndex: 4,
        top: `${spot.top}px`,
        left: `${spot.left}px`,
        display: 'grid',
        gridTemplateColumns: 'repeat(2, auto)',
      }}
    >
      {/* each type with its name, two to a row */}
      {PIN_TYPES.map((item) => {
        const picked = editor.pinType === item.id;
        return (
          <ButtonBase
            key={item.id}
            disableRipple
            aria-pressed={picked}
            onClick={() => editor.pickPinType(item.id)}
            sx={{
              justifyContent: 'flex-start',
              gap: '8px',
              height: '32px',
              padding: '0 10px 0 6px',
              borderRadius: 'var(--radius-m)',
              backgroundColor: picked ? 'var(--accent-150)' : 'transparent',
              '&:hover': { backgroundColor: 'var(--accent-100)' },
            }}
          >
            <PinIcon type={item.id} color="var(--accent-main)" size={18} />
            <Typography
              className="body-small-regular"
              color={picked ? 'var(--accent-dark)' : 'var(--black)'}
              noWrap
            >
              {t(item.label)}
            </Typography>
          </ButtonBase>
        );
      })}
    </Box>
  );
};

// where the bar floats: above the picked drawing, in screen pixels of the map
const useAnchor = (editor: Editor, map?: maplibregl.Map | null) => {
  const [anchor, setAnchor] = useState<{ x: number; y: number }>();

  useEffect(() => {
    const terra = editor.active.current;
    if (!map || !terra || editor.selected === undefined) {
      setAnchor(undefined);
      return;
    }

    const update = () => {
      const feature = terra.hasFeature(editor.selected!)
        ? terra.getSnapshotFeature(editor.selected!)
        : undefined;
      if (!feature) return setAnchor(undefined);

      let coordinates: number[][];
      if (feature.geometry.type === 'Polygon')
        coordinates = feature.geometry.coordinates[0] as number[][];
      else if (feature.geometry.type === 'LineString')
        coordinates = feature.geometry.coordinates as number[][];
      else coordinates = [feature.geometry.coordinates as number[]];
      const points = coordinates.map((c) => map.project(c as [number, number]));
      // a drawing larger than the view, like the congregation's border,
      // centres the bar on the part that shows
      const { clientWidth, clientHeight } = map.getContainer();
      const xs = points.map((p) => Math.min(Math.max(p.x, 0), clientWidth));
      const top = Math.min(...points.map((p) => p.y));
      setAnchor({
        x: (Math.min(...xs) + Math.max(...xs)) / 2,
        y: Math.min(Math.max(top, 0), clientHeight),
      });
    };

    update();
    map.on('move', update);
    return () => {
      map.off('move', update);
    };
  }, [map, editor.active, editor.selected, editor.draft]);

  return anchor;
};

const BAR_GAP = 14;
// the rail's width and the gaps around it
const RAIL_SPACE = 72;

const drawingStyleOptions = (
  editor: Editor,
  kind: MapItemKind | undefined,
  finished: ReactNode,
  t: ReturnType<typeof useAppTranslation>['t']
) => {
  let content: ReactNode = null;
  const activeShape =
    !kind && editor.tool === 'shape' ? editor.shape : undefined;
  const activeLine = !kind && editor.tool === 'line' ? editor.line : undefined;
  const shape = kind === 'shape' ? editor.selectedStyle : activeShape;
  const line = kind === 'line' ? editor.selectedLine : activeLine;

  if (shape) {
    content = (
      <>
        <ColorPicker
          label={t('tr_territoryOutline')}
          value={shape.border}
          allowNone
          onPick={(border) => editor.pickShape({ border })}
        />
        {shape.border !== 'transparent' && (
          <DashToggle
            dashed={!!shape.dashed}
            onPick={(dashed) => editor.pickShape({ dashed })}
          />
        )}
        <ColorPicker
          label={t('tr_territoryFill')}
          value={shape.fill}
          allowNone
          onPick={(fill) => editor.pickShape({ fill })}
        />
        {kind && finished}
      </>
    );
  } else if (line) {
    content = (
      <>
        <DashToggle
          dashed={line.style === 'dashed'}
          onPick={(dashed) =>
            editor.pickLine({ style: dashed ? 'dashed' : 'solid' })
          }
        />
        <ColorPicker
          label={t('tr_territoryColour')}
          value={line.color}
          allowNone={false}
          onPick={(color) =>
            color !== 'transparent' && editor.pickLine({ color })
          }
        />
        {kind && finished}
      </>
    );
  } else if (kind === 'pin') {
    const current = (editor.draft.markers.find(
      (m) => m.id === String(editor.selected)
    )?.pinType ?? 'normal') as PinType;
    content = (
      <>
        <PinTypes value={current} onPick={editor.pickPinType} />
        {kind && finished}
      </>
    );
  } else if (kind === 'text') {
    content = (
      <>
        <IconButton
          label={t('tr_territoryEditText')}
          icon={<IconEdit />}
          placement="top"
          onClick={() => editor.editLabel()}
        />
        {finished}
      </>
    );
  }
  return content;
};

// the options of what is picked, or of the tool about to draw, next to the drawing
export const StyleBar = ({
  editor,
  map,
  minTop,
  canSave,
  onSave,
}: {
  editor: Editor;
  map?: maplibregl.Map | null;
  // the bottom of the bar along the top: the style bar never goes over it
  minTop: number;
  canSave: boolean;
  onSave: VoidFunction;
}) => {
  const { t } = useAppTranslation();

  const anchor = useAnchor(editor, map);
  const [size, setSize] = useState({ width: 0, height: 46 });
  // its own size, so it ends above the drawing and stays inside the map
  const bar = (node: HTMLDivElement | null) => {
    if (
      node &&
      (node.offsetHeight !== size.height || node.offsetWidth !== size.width)
    ) {
      setSize({ width: node.offsetWidth, height: node.offsetHeight });
    }
  };
  // with nothing picked while moving or adjusting, the bar shows the border's
  // options, so the ✓ that saves is always at hand
  const idle =
    editor.selectedKind === undefined &&
    (editor.tool === 'move' || editor.tool === 'points') &&
    !!editor.draft.boundary?.length;
  const kind: MapItemKind | undefined =
    editor.selectedKind ?? (idle ? 'boundary' : undefined);
  const congregation = editor.scope === 'congregation';

  let content: ReactNode = null;

  const remove = (
    <IconButton
      label={t('tr_delete')}
      icon={<IconDelete />}
      placement="top"
      danger
      onClick={editor.deleteSelected}
    />
  );

  // done with this drawing; the tool stays
  const done = (
    <IconButton
      label={t('tr_done')}
      icon={<IconCheck />}
      placement="top"
      onClick={editor.deselect}
    />
  );

  // the actions, set apart from the choices before them
  const finished = (
    <>
      <Divider vertical={false} />
      {remove}
      {done}
    </>
  );

  // the next pin's type opens beside the rail, not over the map
  if (!kind && !editor.cornerPicked && editor.tool === 'pin') {
    return <PinFlyout editor={editor} map={map} />;
  }

  if (editor.cornerPicked) {
    content = (
      <Button
        variant="small"
        color="red"
        disableAutoStretch
        startIcon={<IconDelete color="var(--red-main)" />}
        onClick={editor.deleteVertex}
        sx={{ minHeight: '32px' }}
      >
        {t('tr_territoryDeletePoint')}
      </Button>
    );
  } else if (kind === 'boundary') {
    content = (
      <>
        <ColorPicker
          label={t('tr_territoryOutline')}
          value={editor.boundaryStyle.border}
          allowNone={false}
          onPick={(border) => editor.pickBoundary({ border })}
        />
        {/* the whole area is an outline only, solid or dashed */}
        {congregation && (
          <DashToggle
            dashed={!!editor.boundaryStyle.dashed}
            onPick={(dashed) => editor.pickBoundary({ dashed })}
          />
        )}
        {!congregation && (
          <ColorPicker
            label={t('tr_territoryFill')}
            value={editor.boundaryStyle.fill}
            allowNone
            onPick={(fill) => editor.pickBoundary({ fill })}
          />
        )}
        <Divider vertical={false} />
        {/* the border goes, and drawing a new one starts */}
        <IconButton
          label={t('tr_territoryDeleteBorder')}
          icon={<IconDelete />}
          placement="top"
          danger
          onClick={editor.redrawBorder}
        />
        <IconButton
          label={t('tr_save')}
          icon={<IconCheck />}
          placement="top"
          disabled={!canSave}
          onClick={onSave}
        />
      </>
    );
  } else {
    content = drawingStyleOptions(editor, kind, finished, t);
  }

  if (!content) return null;

  const floating = anchor && editor.selectedKind;
  const mapWidth = map?.getContainer().clientWidth ?? 0;
  const half = size.width / 2;
  // one row always; near an edge it slides in rather than wrapping, clear
  // of the tool rail down the left
  const left = floating
    ? Math.min(
        Math.max(anchor.x, half + RAIL_SPACE),
        Math.max(mapWidth - half - 12, half + RAIL_SPACE)
      )
    : 0;

  return (
    <Stack
      ref={bar}
      direction="row"
      sx={{
        ...SHELL,
        position: 'absolute',
        zIndex: 4,
        width: 'max-content',
        maxWidth: 'calc(100% - 24px)',
        ...(floating
          ? {
              left: `${left}px`,
              // above the drawing, but never over the bar along the top
              top: `${Math.max(anchor.y - BAR_GAP - size.height, minTop + 8)}px`,
              transform: 'translateX(-50%)',
            }
          : {
              left: '50%',
              top: `${minTop + 8}px`,
              transform: 'translateX(-50%)',
            }),
        transition: 'opacity 0.15s ease',
      }}
    >
      {content}
    </Stack>
  );
};

// what the split or merge tool wants next, where the style bar would be
export const ToolHint = ({
  minTop,
  text,
  action,
}: {
  minTop: number;
  text: string;
  action?: ReactNode;
}) => (
  <Stack
    direction="row"
    role="status"
    sx={{
      ...SHELL,
      position: 'absolute',
      zIndex: 4,
      left: '50%',
      top: `${minTop + 8}px`,
      transform: 'translateX(-50%)',
      width: 'max-content',
      maxWidth: 'calc(100% - 24px)',
      minHeight: '46px',
      boxSizing: 'border-box',
      padding: action ? '4px 4px 4px 12px' : '4px 12px',
      gap: '12px',
    }}
  >
    <Typography className="body-small-regular" color="var(--grey-400)">
      {text}
    </Typography>
    {action}
  </Stack>
);

// the territory, Cancel and Save, at the top of the map
// saving is the ✓ on the style bar; Cancel stays here with the name
export const EditHeader = ({
  title,
  onUp,
  onCancel,
}: {
  title: string;
  // a territory's way one level up, to the congregation's whole area
  onUp?: VoidFunction;
  onCancel: VoidFunction;
}) => {
  const { t } = useAppTranslation();

  return (
    <Stack spacing="6px" sx={{ alignItems: 'flex-start', minWidth: 0 }}>
      <Stack
        direction="row"
        // as tall as the mode switch beside it
        sx={{
          ...SHELL,
          height: '46px',
          boxSizing: 'border-box',
          alignItems: 'center',
          padding: '4px 4px 4px 12px',
          gap: '8px',
        }}
      >
        {onUp && (
          <>
            <ButtonBase
              disableRipple
              onClick={onUp}
              sx={{
                borderRadius: 'var(--radius-s)',
                '&:hover p': { textDecoration: 'underline' },
              }}
            >
              <Typography
                className="body-small-semibold"
                color="var(--accent-main)"
                noWrap
              >
                {t('tr_territoryCongregationArea')}
              </Typography>
            </ButtonBase>
            <Typography className="body-small-regular" color="var(--grey-350)">
              ›
            </Typography>
          </>
        )}
        <Typography className="body-small-semibold" color="var(--black)" noWrap>
          {title}
        </Typography>
        {/* the button's own 10px padding sits after the line, so the same
            10px before it keeps the line visually centred */}
        <CustomDivider
          orientation="vertical"
          flexItem
          color="var(--accent-200)"
          sx={{ margin: '6px 0 6px 10px' }}
        />
        <Button
          variant="secondary"
          disableAutoStretch
          startIcon={<IconClose />}
          onClick={onCancel}
          sx={{ minHeight: '32px', padding: '4px 10px' }}
        >
          {t('tr_cancel')}
        </Button>
      </Stack>
    </Stack>
  );
};

export type ContextSpot = {
  x: number;
  y: number;
  at: [number, number];
  item?: { id: string | number; kind: MapItemKind };
  corner: boolean;
};

// a right click, or a long press on a phone: what fits right there
export const MapContextMenu = ({
  editor,
  spot,
  onClose,
}: {
  editor: Editor;
  spot?: ContextSpot;
  onClose: VoidFunction;
}) => {
  const { t } = useAppTranslation();

  if (!spot) return null;

  const hasBorder = !!editor.draft.boundary?.length;
  const congregation = editor.scope === 'congregation';
  const item = spot.item;

  const entries: {
    label: string;
    icon: ReactElement<{ color?: string }>;
    danger?: boolean;
    run: VoidFunction;
  }[] = [];

  if (spot.corner) {
    entries.push({
      label: t('tr_territoryDeletePoint'),
      icon: <IconDelete />,
      danger: true,
      run: editor.deleteVertex,
    });
  }

  if (item) {
    if (
      item.kind === 'boundary' ||
      item.kind === 'shape' ||
      item.kind === 'line'
    ) {
      entries.push({
        label: t('tr_territoryAdjustPoints'),
        icon: <IconPolyline />,
        run: () => editor.selectItem(item.id, true),
      });
    }
    if (item.kind !== 'boundary') {
      entries.push({
        label: t('tr_territoryMoveItems'),
        icon: <IconMoveAround />,
        run: () => editor.selectItem(item.id),
      });
    }
    if (item.kind === 'text') {
      entries.push({
        label: t('tr_territoryEditText'),
        icon: <IconEdit />,
        run: () => editor.editLabel(item.id),
      });
    }
    if (item.kind === 'boundary') {
      entries.push({
        label: t('tr_territoryDeleteBorder'),
        icon: <IconDelete />,
        danger: true,
        run: editor.redrawBorder,
      });
    } else {
      entries.push({
        label: t('tr_delete'),
        icon: <IconDelete />,
        danger: true,
        run: () => editor.deleteItem(item.id),
      });
    }
  } else if (hasBorder && !congregation) {
    entries.push(
      {
        label: t('tr_territoryAddPinHere'),
        icon: <IconAddPin />,
        run: () => editor.addMarkerAt('pin', spot.at),
      },
      {
        label: t('tr_territoryAddTextHere'),
        icon: <IconTypeText />,
        run: () => editor.addMarkerAt('text', spot.at),
      },
      {
        label: t('tr_territoryDrawAnArea'),
        icon: <IconActivityZone />,
        run: () => editor.pickTool('shape'),
      },
      {
        label: t('tr_territoryDrawALine'),
        icon: <IconDrawLine />,
        run: () => editor.pickTool('line'),
      }
    );
  }

  if (entries.length === 0) return null;

  return (
    <Menu
      open
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={{ top: spot.y, left: spot.x }}
      slotProps={{
        paper: {
          sx: {
            ...SHELL,
            minWidth: '200px',
            backgroundImage: 'none',
          },
        },
      }}
    >
      {entries.map((entry) => (
        <MenuItem
          key={entry.label}
          onClick={() => {
            onClose();
            entry.run();
          }}
          sx={{ gap: '10px', minHeight: '40px' }}
        >
          {cloneElement(entry.icon, {
            color: entry.danger ? 'var(--red-main)' : 'var(--accent-main)',
          })}
          <Typography
            className="body-small-regular"
            color={entry.danger ? 'var(--red-main)' : 'var(--black)'}
          >
            {entry.label}
          </Typography>
        </MenuItem>
      ))}
    </Menu>
  );
};
