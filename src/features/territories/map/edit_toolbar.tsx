import {
  MouseEvent,
  ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Box, ButtonBase, Menu, Stack } from '@mui/material';
import { CustomDivider, Typography } from '@components/index';
import MenuItem from '@components/menuitem';
import Tooltip from '@components/tooltip';
import MenuSubHeader from '@components/menu_sub_header';
import {
  IconAddPin,
  IconCheck,
  IconDashedLine,
  IconDrawLine,
  IconEditPoints,
  IconCongregationBorder,
  IconMoveAround,
  IconNavigateLeft,
  IconNavigateRight,
  IconRedo,
  IconShapes,
  IconSolidLine,
  IconTypeText,
  IconUndo,
} from '@icons/index';
import { MapColor } from '@definition/territory';
import { MAP_COLOR_LABEL, MAP_COLORS, PIN_TYPES } from './constants';
import PinIcon from './pin_icon';
import useMapEditor, { MapTool } from './useMapEditor';

type Editor = ReturnType<typeof useMapEditor>;

const COLORS = Object.keys(MAP_COLORS) as MapColor[];

const ToolButton = ({
  label,
  icon,
  active = false,
  compact,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  active?: boolean;
  compact: boolean;
  onClick: (event: MouseEvent<HTMLElement>) => void;
}) => (
  <Tooltip title={label} enterDelay={2000}>
    <ButtonBase
      disableRipple
      aria-label={compact ? label : undefined}
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 10px',
        cursor: 'pointer',
        borderRadius: 'var(--radius-m)',
        backgroundColor: active ? 'var(--accent-150)' : 'transparent',
        transition: 'background-color 0.15s ease',
        '&:hover': { backgroundColor: 'var(--accent-100)' },
        '&:focus-visible': { outline: 'var(--accent-main) auto 1px' },
      }}
    >
      {icon}
      {!compact && (
        <Typography
          className="body-small-semibold"
          color={active ? 'var(--accent-dark)' : 'var(--accent-main)'}
          noWrap
        >
          {label}
        </Typography>
      )}
    </ButtonBase>
  </Tooltip>
);

const Swatch = ({ color }: { color: MapColor | 'transparent' }) => (
  <Box
    sx={{
      width: '16px',
      height: '16px',
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

const Option = ({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: VoidFunction;
  children: ReactNode;
}) => (
  <MenuItem selected={selected} onClick={onClick}>
    <Stack
      direction="row"
      sx={{ alignItems: 'center', gap: '10px', flexGrow: 1 }}
    >
      {children}
    </Stack>
    {selected && (
      <IconCheck color="var(--accent-main)" width={18} height={18} />
    )}
  </MenuItem>
);

const menuPaper = {
  paper: {
    style: {
      borderRadius: 'var(--radius-l)',
      border: '1px solid var(--accent-200)',
      backgroundColor: 'var(--white)',
      minWidth: '220px',
    },
  },
};

const SHELL = {
  alignItems: 'center',
  gap: '2px',
  padding: '4px',
  borderRadius: 'var(--radius-l)',
  backgroundColor: 'var(--white)',
  border: '1px solid var(--accent-200)',
  boxShadow: 'var(--hover-shadow)',
};

const Divider = () => (
  <CustomDivider
    orientation="vertical"
    flexItem
    color="var(--accent-200)"
    sx={{ margin: '6px 2px' }}
  />
);

export const IdleToolbar = ({
  onCongregation,
}: {
  onCongregation: VoidFunction;
}) => (
  <Stack direction="row" sx={{ flexShrink: 0, ...SHELL }}>
    <Typography
      className="body-small-regular"
      color="var(--grey-400)"
      noWrap
      sx={{ padding: '0 10px' }}
    >
      Pick a territory to draw its map
    </Typography>

    <Divider />

    <ToolButton
      label="Congregation border"
      compact={false}
      icon={<IconCongregationBorder color="var(--accent-main)" />}
      onClick={onCongregation}
    />
  </Stack>
);

const EditToolbar = ({
  editor,
  onCongregation,
}: {
  editor: Editor;
  onCongregation: VoidFunction;
}) => {
  const [compact, setCompact] = useState(false);

  const [squeeze, setSqueeze] = useState(0);
  const [room, setRoom] = useState(0);

  const frame = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = frame.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) =>
      setRoom(entry.contentRect.width)
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    setSqueeze(0);
  }, [room, compact, editor.scope]);

  useLayoutEffect(() => {
    if (!bar.current || squeeze >= 3) return;
    if (bar.current.offsetWidth > room) setSqueeze(squeeze + 1);
  }, [squeeze, room]);

  const historyCompact = compact || squeeze >= 1;
  const toggleCompact = compact || squeeze >= 2;
  const toolCompact = compact || squeeze >= 3;
  const [menu, setMenu] = useState<{ tool: MapTool; anchor: HTMLElement }>();

  const territoryScope = editor.scope === 'territory';

  const style = editor.selectedStyle ?? editor.shape;

  const open = (tool: MapTool) => (event: MouseEvent<HTMLElement>) =>
    setMenu({ tool, anchor: event.currentTarget });

  const close = () => setMenu(undefined);

  const iconColor = (tool: MapTool) =>
    editor.tool === tool ? 'var(--accent-dark)' : 'var(--accent-main)';

  return (
    <Stack
      ref={frame}
      spacing="8px"
      sx={{ alignItems: 'flex-start', flexGrow: 1, minWidth: 0 }}
    >
      <Stack ref={bar} direction="row" sx={{ flexShrink: 0, ...SHELL }}>
        <ToolButton
          label="Undo"
          compact={historyCompact}
          icon={<IconUndo color="var(--accent-main)" />}
          onClick={editor.undo}
        />
        <ToolButton
          label="Redo"
          compact={historyCompact}
          icon={<IconRedo color="var(--accent-main)" />}
          onClick={editor.redo}
        />

        <Divider />

        {territoryScope && (
          <ToolButton
            label="Text"
            compact={toolCompact}
            active={editor.tool === 'text'}
            icon={<IconTypeText color={iconColor('text')} />}
            onClick={() => editor.pickTool('text')}
          />
        )}

        {(territoryScope || !editor.draft.boundary?.length) && (
          <ToolButton
            label="Shape"
            compact={toolCompact}
            active={editor.tool === 'shape'}
            icon={<IconShapes color={iconColor('shape')} />}
            onClick={
              territoryScope ? open('shape') : () => editor.pickTool('shape')
            }
          />
        )}

        {territoryScope && (
          <>
            <ToolButton
              label="Pin"
              compact={toolCompact}
              active={editor.tool === 'pin'}
              icon={<IconAddPin color={iconColor('pin')} />}
              onClick={open('pin')}
            />
            <ToolButton
              label="Line"
              compact={toolCompact}
              active={editor.tool === 'line'}
              icon={<IconDrawLine color={iconColor('line')} />}
              onClick={open('line')}
            />
          </>
        )}

        <ToolButton
          label="Move"
          compact={toolCompact}
          active={editor.tool === 'move'}
          icon={<IconMoveAround color={iconColor('move')} />}
          onClick={() => editor.pickTool('move')}
        />

        <ToolButton
          label="Points"
          compact={toolCompact}
          active={editor.tool === 'points'}
          icon={<IconEditPoints color={iconColor('points')} />}
          onClick={() => editor.pickTool('points')}
        />

        <Divider />

        <ToolButton
          label="Congregation border"
          compact={toolCompact}
          active={!territoryScope}
          icon={
            <IconCongregationBorder
              color={
                territoryScope ? 'var(--accent-main)' : 'var(--accent-dark)'
              }
            />
          }
          onClick={onCongregation}
        />

        <Divider />

        <ToolButton
          label="Drawing tools"
          compact={toggleCompact}
          icon={
            compact ? (
              <IconNavigateRight color="var(--accent-main)" />
            ) : (
              <IconNavigateLeft color="var(--accent-main)" />
            )
          }
          onClick={() => setCompact(!compact)}
        />

        <Menu
          anchorEl={menu?.anchor}
          open={menu?.tool === 'shape'}
          onClose={close}
          disableScrollLock
          slotProps={menuPaper}
        >
          <MenuSubHeader>
            {editor.selectedStyle ? 'Selected shape · Border' : 'Border'}
          </MenuSubHeader>
          {(['transparent', ...COLORS] as const).map((color) => (
            <Option
              key={`border-${color}`}
              selected={style.border === color}
              onClick={() => editor.pickShape({ border: color })}
            >
              <Swatch color={color} />
              <Typography className="body-regular">
                {color === 'transparent'
                  ? 'Transparent'
                  : MAP_COLOR_LABEL[color]}
              </Typography>
            </Option>
          ))}

          <MenuSubHeader>Fill</MenuSubHeader>
          {(['transparent', ...COLORS] as const).map((color) => (
            <Option
              key={`fill-${color}`}
              selected={style.fill === color}
              onClick={() => editor.pickShape({ fill: color })}
            >
              <Swatch color={color} />
              <Typography className="body-regular">
                {color === 'transparent'
                  ? 'Transparent'
                  : MAP_COLOR_LABEL[color]}
              </Typography>
            </Option>
          ))}
        </Menu>

        <Menu
          anchorEl={menu?.anchor}
          open={menu?.tool === 'pin'}
          onClose={close}
          disableScrollLock
          slotProps={menuPaper}
        >
          {PIN_TYPES.map((item) => (
            <Option
              key={item.id}
              selected={editor.pinType === item.id}
              onClick={() => {
                editor.pickPinType(item.id);
                close();
              }}
            >
              <PinIcon type={item.id} color="var(--black)" size={18} />
              <Typography className="body-regular">{item.label}</Typography>
            </Option>
          ))}
        </Menu>

        <Menu
          anchorEl={menu?.anchor}
          open={menu?.tool === 'line'}
          onClose={close}
          disableScrollLock
          slotProps={menuPaper}
        >
          <Option
            selected={editor.lineStyle === 'solid'}
            onClick={() => {
              editor.pickLineStyle('solid');
              close();
            }}
          >
            <IconSolidLine color="var(--black)" />
            <Typography className="body-regular">Solid</Typography>
          </Option>
          <Option
            selected={editor.lineStyle === 'dashed'}
            onClick={() => {
              editor.pickLineStyle('dashed');
              close();
            }}
          >
            <IconDashedLine color="var(--black)" />
            <Typography className="body-regular">Dashed</Typography>
          </Option>
        </Menu>
      </Stack>
    </Stack>
  );
};

export default EditToolbar;
