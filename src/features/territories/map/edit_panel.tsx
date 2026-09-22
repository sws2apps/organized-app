import { cloneElement, ReactElement, ReactNode } from 'react';
import { Box, ButtonBase, Stack } from '@mui/material';
import { Button, CustomDivider, Typography } from '@components/index';
import {
  IconAddPin,
  IconCheckCircle,
  IconDashedLine,
  IconDelete,
  IconDrawLine,
  IconDrawShape,
  IconRefresh,
  IconShapes,
  IconSolidLine,
  IconTypeText,
} from '@icons/index';
import { MapColor, Territory } from '@definition/territory';
import { MAP_COLOR_LABEL, MAP_COLORS, PIN_TYPES } from './constants';
import PinIcon from './pin_icon';
import useMapEditor, { MapItemKind, MapTool } from './useMapEditor';

type Editor = ReturnType<typeof useMapEditor>;

const COLORS = Object.keys(MAP_COLORS) as MapColor[];

const KIND_LABEL: Record<MapItemKind, string> = {
  boundary: 'Border',
  shape: 'Area',
  line: 'Line',
  pin: 'Pin',
  text: 'Text note',
};

const TOOL_HINT: Partial<Record<MapTool, string>> = {
  text: 'Click on the map where the note should go.',
  pin: 'Pick a pin type, then click on the map to place it.',
  line: 'Click to start the line and to add each bend. Double-click or press Enter to finish.',
  shape:
    'Pick colors, then click around the area. Click the first corner again to close it.',
  move: 'Drag a pin, note, line or area to move it. Click one to select it.',
  points:
    'Drag a corner to move it, or drag a small midpoint to add a corner. Click a corner and press Delete to remove it.',
};

const Section = ({
  step,
  title,
  done = false,
  disabled = false,
  children,
}: {
  step?: number;
  title: string;
  done?: boolean;
  disabled?: boolean;
  children: ReactNode;
}) => (
  <Stack spacing="10px" sx={{ opacity: disabled ? 0.5 : 1 }}>
    <Stack direction="row" spacing="8px" sx={{ alignItems: 'center' }}>
      {done ? (
        <IconCheckCircle color="var(--green-main)" width={20} height={20} />
      ) : (
        step && (
          <Box
            sx={{
              width: '20px',
              height: '20px',
              borderRadius: 'var(--radius-max)',
              backgroundColor: 'var(--accent-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              className="label-small-medium"
              color="var(--always-white)"
            >
              {step}
            </Typography>
          </Box>
        )
      )}
      <Typography className="h4" color="var(--black)">
        {title}
      </Typography>
    </Stack>
    {children}
  </Stack>
);

const Hint = ({ children }: { children: ReactNode }) => (
  <Typography className="body-small-regular" color="var(--grey-400)">
    {children}
  </Typography>
);

const Chip = ({
  selected,
  onClick,
  children,
  label,
}: {
  selected: boolean;
  onClick: VoidFunction;
  children: ReactNode;
  label: string;
}) => (
  <ButtonBase
    disableRipple
    aria-pressed={selected}
    aria-label={label}
    title={label}
    onClick={onClick}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 8px',
      borderRadius: 'var(--radius-m)',
      border: selected
        ? '1px solid var(--accent-main)'
        : '1px solid var(--accent-200)',
      backgroundColor: selected ? 'var(--accent-150)' : 'var(--white)',
      '&:hover': { backgroundColor: 'var(--accent-100)' },
      '&:focus-visible': { outline: 'var(--accent-main) auto 1px' },
    }}
  >
    {children}
  </ButtonBase>
);

const Swatch = ({ color }: { color: MapColor | 'transparent' }) => (
  <Box
    sx={{
      width: '14px',
      height: '14px',
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

const ColorRow = ({
  label,
  value,
  onPick,
}: {
  label: string;
  value: MapColor | 'transparent';
  onPick: (color: MapColor | 'transparent') => void;
}) => (
  <Stack spacing="6px">
    <Typography className="label-small-medium" color="var(--grey-400)">
      {label}
    </Typography>
    <Stack direction="row" sx={{ flexWrap: 'wrap', gap: '6px' }}>
      {(['transparent', ...COLORS] as const).map((color) => (
        <Chip
          key={color}
          label={color === 'transparent' ? 'None' : MAP_COLOR_LABEL[color]}
          selected={value === color}
          onClick={() => onPick(color)}
        >
          <Swatch color={color} />
        </Chip>
      ))}
    </Stack>
  </Stack>
);

const ExtraTool = ({
  tool,
  label,
  icon,
  editor,
  disabled,
}: {
  tool: MapTool;
  label: string;
  icon: ReactElement<{ color?: string }>;
  editor: Editor;
  disabled: boolean;
}) => {
  const active = editor.tool === tool;

  return (
    <ButtonBase
      disableRipple
      disabled={disabled}
      aria-pressed={active}
      onClick={() => editor.pickTool(tool)}
      sx={{
        flex: '1 1 0',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        padding: '8px 4px',
        borderRadius: 'var(--radius-m)',
        border: active
          ? '1px solid var(--accent-main)'
          : '1px solid var(--accent-200)',
        backgroundColor: active ? 'var(--accent-150)' : 'var(--white)',
        '&:hover': { backgroundColor: 'var(--accent-100)' },
        '&:focus-visible': { outline: 'var(--accent-main) auto 1px' },
      }}
    >
      {cloneElement(icon, {
        color: active ? 'var(--accent-dark)' : 'var(--accent-main)',
      })}
      <Typography
        className="label-small-medium"
        color={active ? 'var(--accent-dark)' : 'var(--accent-main)'}
        noWrap
      >
        {label}
      </Typography>
    </ButtonBase>
  );
};

const EditPanel = ({
  editor,
  territory,
}: {
  editor: Editor;
  territory?: Territory;
}) => {
  const congregation = editor.scope === 'congregation';
  const hasBorder = !!editor.draft.boundary?.length;
  const drawingBorder = editor.tool === 'border';

  const title = congregation
    ? 'Congregation border'
    : `Territory ${territory?.number ?? ''}`;

  const subtitle = congregation
    ? 'The outer border of everything the congregation covers'
    : territory?.name;

  const extrasTool = ['text', 'pin', 'line', 'shape'].includes(editor.tool);
  const selectedExtra =
    editor.selectedKind !== undefined && editor.selectedKind !== 'boundary';

  return (
    <Stack
      spacing="16px"
      divider={<CustomDivider color="var(--accent-200)" />}
      sx={{
        padding: '16px',
        borderRadius: 'var(--radius-l)',
        border: '1px solid var(--accent-200)',
        backgroundColor: 'var(--white)',
        overflowY: 'auto',
        minHeight: 0,
      }}
    >
      <Box>
        <Typography className="h3" color="var(--black)">
          {title}
        </Typography>
        {subtitle && (
          <Typography className="body-small-regular" color="var(--grey-400)">
            {subtitle}
          </Typography>
        )}
      </Box>

      <Section step={1} title="Border" done={hasBorder && !drawingBorder}>
        {!hasBorder && (
          <Box
            sx={{
              padding: '10px 12px',
              borderRadius: 'var(--radius-m)',
              backgroundColor: 'var(--accent-150)',
            }}
          >
            <Typography className="body-small-regular" color="var(--black)">
              Click on the map to place the first corner, then keep clicking
              around the area. Click the first corner again or press Enter to
              close the border. Press Esc to start over.
            </Typography>
          </Box>
        )}

        {hasBorder && (
          <>
            <Hint>
              {editor.tool === 'points'
                ? TOOL_HINT.points
                : 'The border is drawn. Choose Adjust points to change its shape.'}
            </Hint>

            <Stack direction="row" spacing="8px">
              {editor.tool !== 'points' && (
                <Button
                  variant="small"
                  disableAutoStretch
                  startIcon={<IconDrawShape color="var(--accent-main)" />}
                  onClick={editor.adjustBorder}
                  sx={{ minHeight: '28px', padding: '2px 8px' }}
                >
                  Adjust border
                </Button>
              )}
              <Button
                variant="small"
                disableAutoStretch
                startIcon={<IconRefresh color="var(--accent-main)" />}
                onClick={editor.redrawBorder}
                sx={{ minHeight: '28px', padding: '2px 8px' }}
              >
                Redraw border
              </Button>
            </Stack>
          </>
        )}
      </Section>

      {!congregation && (
        <Section step={2} title="Map notes (optional)" disabled={!hasBorder}>
          <Hint>
            {hasBorder
              ? 'Mark what publishers should know. Notes are printed on the territory card.'
              : 'Draw the border first.'}
          </Hint>

          <Stack direction="row" spacing="6px">
            <ExtraTool
              tool="text"
              label="Text"
              icon={<IconTypeText />}
              editor={editor}
              disabled={!hasBorder}
            />
            <ExtraTool
              tool="pin"
              label="Pin"
              icon={<IconAddPin />}
              editor={editor}
              disabled={!hasBorder}
            />
            <ExtraTool
              tool="line"
              label="Line"
              icon={<IconDrawLine />}
              editor={editor}
              disabled={!hasBorder}
            />
            <ExtraTool
              tool="shape"
              label="Area"
              icon={<IconShapes />}
              editor={editor}
              disabled={!hasBorder}
            />
          </Stack>

          {extrasTool && hasBorder && (
            <Stack spacing="10px">
              {editor.tool === 'pin' && (
                <Stack direction="row" sx={{ flexWrap: 'wrap', gap: '6px' }}>
                  {PIN_TYPES.map((item) => (
                    <Chip
                      key={item.id}
                      label={item.label}
                      selected={editor.pinType === item.id}
                      onClick={() => editor.pickPinType(item.id)}
                    >
                      <PinIcon type={item.id} color="var(--black)" size={16} />
                      <Typography className="label-small-regular">
                        {item.label}
                      </Typography>
                    </Chip>
                  ))}
                </Stack>
              )}

              {editor.tool === 'line' && (
                <Stack direction="row" sx={{ gap: '6px' }}>
                  <Chip
                    label="Solid"
                    selected={editor.lineStyle === 'solid'}
                    onClick={() => editor.pickLineStyle('solid')}
                  >
                    <IconSolidLine color="var(--black)" />
                    <Typography className="label-small-regular">
                      Solid
                    </Typography>
                  </Chip>
                  <Chip
                    label="Dashed"
                    selected={editor.lineStyle === 'dashed'}
                    onClick={() => editor.pickLineStyle('dashed')}
                  >
                    <IconDashedLine color="var(--black)" />
                    <Typography className="label-small-regular">
                      Dashed
                    </Typography>
                  </Chip>
                </Stack>
              )}

              {editor.tool === 'shape' && (
                <>
                  <ColorRow
                    label="Outline"
                    value={editor.shape.border}
                    onPick={(border) => editor.pickShape({ border })}
                  />
                  <ColorRow
                    label="Fill"
                    value={editor.shape.fill}
                    onPick={(fill) => editor.pickShape({ fill })}
                  />
                </>
              )}

              <Hint>{TOOL_HINT[editor.tool]}</Hint>
            </Stack>
          )}

          {editor.tool === 'move' && <Hint>{TOOL_HINT.move}</Hint>}
        </Section>
      )}

      {editor.selectedKind && (
        <Stack spacing="10px">
          <Typography className="h4" color="var(--black)">
            Selected: {KIND_LABEL[editor.selectedKind]}
          </Typography>

          {editor.selectedKind === 'shape' && editor.selectedStyle && (
            <>
              <ColorRow
                label="Outline"
                value={editor.selectedStyle.border}
                onPick={(border) => editor.pickShape({ border })}
              />
              <ColorRow
                label="Fill"
                value={editor.selectedStyle.fill}
                onPick={(fill) => editor.pickShape({ fill })}
              />
            </>
          )}

          <Button
            variant="small"
            color="red"
            disableAutoStretch
            startIcon={<IconDelete color="var(--red-main)" />}
            onClick={editor.deleteSelected}
            sx={{
              minHeight: '28px',
              padding: '2px 8px',
              alignSelf: 'flex-start',
            }}
          >
            {selectedExtra ? 'Delete' : 'Delete border'}
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default EditPanel;
