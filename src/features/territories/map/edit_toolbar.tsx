import { cloneElement, ReactElement } from 'react';
import { Box, ButtonBase, Stack } from '@mui/material';
import { CustomDivider, Typography } from '@components/index';
import Tooltip from '@components/tooltip';
import {
  IconArrowLink,
  IconCongregationBorder,
  IconEditPoints,
  IconMoveAround,
  IconRedo,
  IconUndo,
} from '@icons/index';
import { STATUS_LABEL, Territory } from '@definition/territory';
import useMapEditor from './useMapEditor';

type Editor = ReturnType<typeof useMapEditor>;

const ToolButton = ({
  label,
  icon,
  active = false,
  disabled = false,
  hint,
  main = false,
  compact = false,
  onClick,
}: {
  label: string;
  icon: ReactElement<{ color?: string }>;
  active?: boolean;
  disabled?: boolean;
  hint?: string;
  main?: boolean;
  // icon only, with the label in the tooltip
  compact?: boolean;
  onClick: VoidFunction;
}) => {
  let color = active ? 'var(--accent-dark)' : 'var(--accent-main)';
  let background = active ? 'var(--accent-150)' : 'transparent';

  if (main) {
    color = 'var(--always-white)';
    background = 'var(--accent-main)';
  }

  const button = (
    <ButtonBase
      disableRipple
      disabled={disabled}
      aria-pressed={active}
      aria-label={compact ? label : undefined}
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: compact ? '6px' : '6px 10px',
        cursor: 'pointer',
        borderRadius: 'var(--radius-m)',
        opacity: disabled ? 0.4 : 1,
        backgroundColor: background,
        transition: 'background-color 0.15s ease',
        '&:hover': {
          backgroundColor: main ? 'var(--accent-dark)' : 'var(--accent-100)',
        },
        '&:focus-visible': { outline: 'var(--accent-main) auto 1px' },
      }}
    >
      {cloneElement(icon, { color })}
      {!compact && (
        <Typography className="body-small-semibold" color={color} noWrap>
          {label}
        </Typography>
      )}
    </ButtonBase>
  );

  const tip = compact ? (hint ?? label) : hint;

  if (!tip) return button;

  return (
    <Tooltip title={tip} enterDelay={600}>
      <span>{button}</span>
    </Tooltip>
  );
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
  compact = false,
}: {
  onCongregation: VoidFunction;
  compact?: boolean;
}) => (
  <Stack direction="row" sx={{ flexShrink: 0, ...SHELL }}>
    <ToolButton
      label="Congregation border"
      hint="Draw the outer border of everything the congregation covers"
      icon={<IconCongregationBorder />}
      compact={compact}
      onClick={onCongregation}
    />
  </Stack>
);

export const ViewToolbar = ({
  selected,
  onDetails,
  compact = false,
}: {
  selected: Territory;
  onDetails: VoidFunction;
  compact?: boolean;
}) => {
  const drawn = !!selected.boundary?.length;

  const info = [selected.city, STATUS_LABEL[selected.status], selected.holder]
    .filter(Boolean)
    .join(' · ');

  return (
    <Stack direction="row" sx={{ flexShrink: 1, minWidth: 0, ...SHELL }}>
      <Box sx={{ padding: '0 10px', minWidth: 0, maxWidth: '320px' }}>
        <Typography className="body-small-semibold" color="var(--black)" noWrap>
          {selected.number} · {selected.name}
        </Typography>
        <Typography
          className="label-small-regular"
          color={drawn ? 'var(--grey-350)' : 'var(--orange-dark)'}
          noWrap
        >
          {drawn ? info : 'No borders drawn yet'}
        </Typography>
      </Box>

      <ToolButton
        label="Details"
        icon={<IconArrowLink />}
        compact={compact}
        onClick={onDetails}
      />
    </Stack>
  );
};

const EditToolbar = ({
  editor,
  compact = false,
}: {
  editor: Editor;
  compact?: boolean;
}) => {
  const hasBorder = !!editor.draft.boundary?.length;

  return (
    <Stack direction="row" sx={{ flexShrink: 0, ...SHELL }}>
      <ToolButton
        label="Undo"
        icon={<IconUndo />}
        compact={compact}
        onClick={editor.undo}
      />
      <ToolButton
        label="Redo"
        icon={<IconRedo />}
        compact={compact}
        onClick={editor.redo}
      />

      <Divider />

      <ToolButton
        label="Adjust points"
        hint="Drag corners and midpoints of the border, areas and lines"
        active={editor.tool === 'points'}
        disabled={!hasBorder}
        icon={<IconEditPoints />}
        compact={compact}
        onClick={editor.adjustBorder}
      />

      <ToolButton
        label="Move items"
        hint="Drag whole pins, notes, lines and areas"
        active={editor.tool === 'move'}
        disabled={!hasBorder}
        icon={<IconMoveAround />}
        compact={compact}
        onClick={() => editor.pickTool('move')}
      />
    </Stack>
  );
};

export default EditToolbar;
