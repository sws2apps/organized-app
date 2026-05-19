import { ReactNode } from 'react';
import { Box, ButtonBase } from '@mui/material';
import { IconChevronRight } from '@components/icons';
import Typography from '@components/typography';

type SettingsTabProps = {
  renderIcon: (color: string) => ReactNode;
  label: string;
  description: string;
  active?: boolean;
  onClick?: () => void;
};

/**
 * Vertical sidebar tab for the Settings redesign.
 * Matches the Penpot "vertical-tab" component specs:
 * - Active: accent-150 bg, 4px accent-main left indicator, accent-dark text, chevron
 * - Inactive: transparent bg, grey-400 text, no indicator
 */
const SettingsTab = ({
  renderIcon,
  label,
  description,
  active = false,
  onClick,
}: SettingsTabProps) => {
  const iconColor = active ? 'var(--accent-dark)' : 'var(--black)';
  const titleColor = active ? 'var(--accent-dark)' : 'var(--black)';
  const descColor = active ? 'var(--accent-400)' : 'var(--grey-350)';

  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '16px',
        width: '100%',
        borderRadius: 'var(--radius-s)',
        backgroundColor: active ? 'var(--accent-150)' : 'transparent',
        padding: 0,
        textAlign: 'left',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'background-color 0.15s ease',
        '&:hover': {
          backgroundColor: active ? 'var(--accent-150)' : 'var(--accent-100)',
        },
        '&:hover .chevron-container': {
          opacity: 1,
        },
      }}
    >
      {/* Left accent indicator */}
      <Box
        sx={{
          width: '4px',
          alignSelf: 'stretch',
          backgroundColor: 'var(--accent-main)',
          borderRadius: '2px',
          opacity: active ? 1 : 0,
          transition: 'opacity 0.15s ease',
          flexShrink: 0,
        }}
      />

      {/* Icon */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 24,
          height: 24,
          flexShrink: 0,
        }}
      >
        {renderIcon(iconColor)}
      </Box>

      {/* Text column */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          flex: 1,
          minWidth: 0,
          paddingTop: '8px',
          paddingBottom: '8px',
        }}
      >
        <Typography
          className="body-regular"
          sx={{
            fontWeight: active ? 500 : 400,
            color: titleColor,
          }}
        >
          {label}
        </Typography>
        <Typography
          className="label-small-regular"
          sx={{
            color: descColor,
          }}
        >
          {description}
        </Typography>
      </Box>

      {/* Right chevron (always present to avoid UI jumps, visible when active) */}
      <Box
        className="chevron-container"
        sx={{
          display: 'flex',
          alignItems: 'center',
          paddingRight: '8px',
          opacity: active ? 1 : 0,
          transition: 'opacity 0.15s ease',
        }}
      >
        <IconChevronRight
          color={active ? 'var(--accent-dark)' : 'var(--grey-350)'}
          width={20}
          height={20}
        />
      </Box>
    </ButtonBase>
  );
};

export default SettingsTab;
