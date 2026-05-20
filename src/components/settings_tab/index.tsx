import { ReactNode } from 'react';
import { IconChevronRight } from '@components/icons';
import Typography from '@components/typography';
import { Tooltip, Box } from '@mui/material';
import {
  StyledSettingsTab,
  IndicatorBar,
  IconWrapper,
  TextColumn,
  ChevronWrapper,
} from './index.styles';

type SettingsTabProps = {
  renderIcon: (color: string) => ReactNode;
  label: string;
  description: string;
  active?: boolean;
  onClick?: () => void;
  mini?: boolean;
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
  mini = false,
}: SettingsTabProps) => {
  const iconColor = active ? 'var(--accent-dark)' : 'var(--black)';
  const titleColor = active ? 'var(--accent-dark)' : 'var(--black)';
  const descColor = active ? 'var(--accent-400)' : 'var(--grey-350)';

  const tabContent = (
    <StyledSettingsTab
      onClick={onClick}
      sx={{
        backgroundColor: active ? 'var(--accent-150)' : 'transparent',
        justifyContent: mini ? 'center' : 'flex-start',
        height: mini ? '48px' : 'auto',
        minHeight: mini ? '48px' : 'auto',
        width: mini ? '48px' : '100%',
        margin: mini ? '0 auto' : '0',
        padding: mini ? 0 : undefined,
        '&:hover': {
          backgroundColor: active ? 'var(--accent-150)' : 'var(--accent-100)',
        },
      }}
    >
      <IndicatorBar sx={{ opacity: active && !mini ? 1 : 0 }} />

      <IconWrapper sx={{ marginLeft: mini ? 0 : 0 }}>{renderIcon(iconColor)}</IconWrapper>

      {!mini && (
        <>
          <TextColumn>
            <Typography
              className="body-regular"
              sx={{ fontWeight: active ? 500 : 400, color: titleColor }}
            >
              {label}
            </Typography>
            <Typography className="label-small-regular" sx={{ color: descColor }}>
              {description}
            </Typography>
          </TextColumn>

          <ChevronWrapper
            className="chevron-container"
            sx={{ opacity: active ? 1 : 0 }}
          >
            <IconChevronRight
              color={active ? 'var(--accent-dark)' : 'var(--grey-350)'}
              width={20}
              height={20}
            />
          </ChevronWrapper>
        </>
      )}
    </StyledSettingsTab>
  );

  if (mini) {
    return (
      <Tooltip title={label} placement="right" arrow>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          {tabContent}
        </Box>
      </Tooltip>
    );
  }

  return tabContent;
};

export default SettingsTab;
