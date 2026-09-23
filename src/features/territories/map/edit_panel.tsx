import { cloneElement, ReactElement, ReactNode } from 'react';
import { Box, ButtonBase, Stack } from '@mui/material';
import { Button, CustomDivider, Typography } from '@components/index';
import {
  IconAddPin,
  IconClose,
  IconDashedLine,
  IconDelete,
  IconDrawLine,
  IconDrawShape,
  IconRefresh,
  IconSave,
  IconShapes,
  IconSolidLine,
  IconTypeText,
} from '@icons/index';
import { MapColor, Territory } from '@definition/territory';
import { MAP_COLOR_LABEL, MAP_COLORS, PIN_TYPES } from './constants';
import PinIcon from './pin_icon';
import useMapEditor, { MapTool } from './useMapEditor';

type Editor = ReturnType<typeof useMapEditor>;

const COLORS = Object.keys(MAP_COLORS) as MapColor[];

const TOOL_HINT: Partial<Record<MapTool, string>> = {
  text: 'Click where the note goes.',
  pin: 'Pick a type, then click to place it.',
  line: 'Click to add bends. Double-click to finish.',
  shape: 'Click to add corners. Click the first one to close.',
  move: 'Drag an item to move it.',
  points: 'Drag corners to reshape. Delete removes a picked corner.',
};

const Section = ({
  step,
  title,
  disabled = false,
  action,
  children,
}: {
  step?: number;
  title: string;
  disabled?: boolean;
  action?: ReactNode;
  children: ReactNode;
}) => (
  <Stack spacing="10px" sx={{ opacity: disabled ? 0.5 : 1 }}>
    <Stack direction="row" spacing="8px" sx={{ alignItems: 'center' }}>
      {step && (
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
      )}
      <Typography className="h4" color="var(--black)">
        {title}
      </Typography>
      {action && <Box sx={{ marginLeft: 'auto !important' }}>{action}</Box>}
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
  allowNone = true,
}: {
  label: string;
  value: MapColor | 'transparent';
  onPick: (color: MapColor | 'transparent') => void;
  allowNone?: boolean;
}) => (
  <Stack spacing="6px">
    <Typography className="label-small-medium" color="var(--grey-400)">
      {label}
    </Typography>
    <Stack direction="row" sx={{ flexWrap: 'wrap', gap: '6px' }}>
      {(allowNone ? (['transparent', ...COLORS] as const) : COLORS).map(
        (color) => (
          <Chip
            key={color}
            label={color === 'transparent' ? 'None' : MAP_COLOR_LABEL[color]}
            selected={value === color}
            onClick={() => onPick(color)}
          >
            <Swatch color={color} />
          </Chip>
        )
      )}
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
  onSave,
}: {
  editor: Editor;
  territory?: Territory;
  onSave: VoidFunction;
}) => {
  const congregation = editor.scope === 'congregation';
  const hasBorder = !!editor.draft.boundary?.length;

  const title = congregation
    ? 'Congregation border'
    : `Territory ${territory?.number ?? ''}`;

  const subtitle = congregation
    ? 'Outer edge of all territories'
    : territory?.name;

  const extrasTool = ['text', 'pin', 'line', 'shape'].includes(editor.tool);
  // the border is replaced with Redraw, so only a picked note needs its own delete
  const pickedNote =
    editor.selectedKind !== undefined && editor.selectedKind !== 'boundary';

  // a picked area shows its own colours, the area tool the ones it draws with
  const shapeStyle =
    editor.selectedKind === 'shape'
      ? editor.selectedStyle
      : editor.tool === 'shape'
        ? editor.shape
        : undefined;

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

      <Section
        step={1}
        title="Border"
        action={
          hasBorder && (
            <Button
              variant="small"
              disableAutoStretch
              startIcon={<IconRefresh color="var(--accent-main)" />}
              onClick={editor.redrawBorder}
              sx={{ minHeight: '28px', padding: '2px 8px' }}
            >
              Redraw
            </Button>
          )
        }
      >
        {!hasBorder && <Hint>{TOOL_HINT.shape}</Hint>}

        {!congregation && (
          <>
            <ColorRow
              label="Outline"
              allowNone={false}
              value={editor.boundaryStyle.border}
              onPick={(border) => editor.pickBoundary({ border })}
            />
            <ColorRow
              label="Fill"
              value={editor.boundaryStyle.fill}
              onPick={(fill) => editor.pickBoundary({ fill })}
            />
          </>
        )}

        {hasBorder && (
          <>
            {editor.tool === 'points' && <Hint>{TOOL_HINT.points}</Hint>}

            {editor.tool !== 'points' && (
              <Button
                variant="small"
                disableAutoStretch
                startIcon={<IconDrawShape color="var(--accent-main)" />}
                onClick={editor.adjustBorder}
                sx={{
                  minHeight: '28px',
                  padding: '2px 8px',
                  alignSelf: 'flex-start',
                }}
              >
                Adjust border
              </Button>
            )}
          </>
        )}
      </Section>

      {!congregation && (
        <Section
          step={2}
          title="Map notes (optional)"
          disabled={!hasBorder}
          action={
            pickedNote && (
              <Button
                variant="small"
                color="red"
                disableAutoStretch
                startIcon={<IconDelete color="var(--red-main)" />}
                onClick={editor.deleteSelected}
                sx={{ minHeight: '28px', padding: '2px 8px' }}
              >
                Delete
              </Button>
            )
          }
        >
          <Hint>
            {hasBorder
              ? 'Printed on the territory card.'
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
            </Stack>
          )}

          {shapeStyle && hasBorder && (
            <Stack spacing="10px">
              <ColorRow
                label="Outline"
                value={shapeStyle.border}
                onPick={(border) => editor.pickShape({ border })}
              />
              <ColorRow
                label="Fill"
                value={shapeStyle.fill}
                onPick={(fill) => editor.pickShape({ fill })}
              />
            </Stack>
          )}

          {extrasTool && hasBorder && <Hint>{TOOL_HINT[editor.tool]}</Hint>}

          {editor.tool === 'move' && <Hint>{TOOL_HINT.move}</Hint>}
        </Section>
      )}

      {/* the last step of the panel, so every action reads top to bottom */}
      <Stack
        direction="row"
        spacing="8px"
        sx={{
          position: 'sticky',
          bottom: '-16px',
          margin: '0 -16px -16px !important',
          padding: '16px',
          backgroundColor: 'var(--white)',
        }}
      >
        <Button
          variant="secondary"
          startIcon={<IconClose />}
          disabled={!editor.canCancel}
          onClick={editor.cancelAction}
          sx={{ flex: 1 }}
        >
          Cancel
        </Button>
        <Button
          variant="main"
          startIcon={<IconSave />}
          disabled={!hasBorder}
          onClick={onSave}
          sx={{ flex: 1 }}
        >
          Save
        </Button>
      </Stack>
    </Stack>
  );
};

export default EditPanel;
