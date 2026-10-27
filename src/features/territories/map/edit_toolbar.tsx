import { useAppTranslation } from '@hooks/index';
import { cloneElement, ReactElement } from 'react';
import { Box, ButtonBase, Stack } from '@mui/material';
import { Typography } from '@components/index';
import Tooltip from '@components/tooltip';
import { IconArrowLink } from '@icons/index';
import { STATUS_LABEL, Territory } from '@definition/territory';
import { territoryHolderText } from '@features/territories/group_holder';
import { DoNotCallBadge } from '@features/territories/components/territory_badges';

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

export const ViewToolbar = ({
  selected,
  onDetails,
  compact = false,
  fullWidth = false,
}: {
  selected: Territory;
  onDetails: VoidFunction;
  compact?: boolean;
  // a row of its own, where the name takes the room it needs
  fullWidth?: boolean;
}) => {
  const { t } = useAppTranslation();

  const drawn = !!selected.boundary?.length;

  const info = [
    // the title already names it when the territory is called after its place
    selected.city !== selected.name && selected.city,
    t(STATUS_LABEL[selected.status]),
    territoryHolderText(selected),
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Stack
      direction="row"
      sx={{
        flexShrink: 1,
        minWidth: 0,
        ...SHELL,
        // as tall as the mode switch beside it
        height: '46px',
        boxSizing: 'border-box',
        ...(fullWidth && { flex: 1 }),
      }}
    >
      <Box
        sx={{
          padding: '0 10px',
          minWidth: 0,
          maxWidth: '320px',
          ...(fullWidth && { flex: 1, maxWidth: 'none' }),
        }}
      >
        <Typography className="body-small-semibold" color="var(--black)" noWrap>
          {selected.number} · {selected.name}
        </Typography>
        <Typography
          className="label-small-regular"
          color={drawn ? 'var(--grey-350)' : 'var(--orange-dark)'}
          noWrap
        >
          {drawn ? info : t('tr_territoryNoBordersDrawnYet')}
        </Typography>
      </Box>

      <DoNotCallBadge territory={selected} />

      <ToolButton
        label={t('tr_details')}
        icon={<IconArrowLink />}
        compact={compact}
        onClick={onDetails}
      />
    </Stack>
  );
};
