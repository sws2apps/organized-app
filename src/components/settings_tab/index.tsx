import { HTMLAttributes, ReactNode } from 'react';
import { IconChevronRight } from '@components/icons';
import Typography from '@components/typography';
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
} & Pick<
  HTMLAttributes<HTMLElement>,
  'role' | 'aria-selected' | 'aria-controls' | 'id' | 'tabIndex'
>;

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
  ...ariaProps
}: SettingsTabProps) => {
  const iconColor = active ? 'var(--accent-dark)' : 'var(--black)';
  const titleColor = active ? 'var(--accent-dark)' : 'var(--black)';
  const descColor = active ? 'var(--accent-400)' : 'var(--grey-350)';

  return (
    <StyledSettingsTab
      onClick={onClick}
      sx={{
        backgroundColor: active ? 'var(--accent-150)' : 'transparent',
        '&:hover': {
          backgroundColor: active ? 'var(--accent-150)' : 'var(--accent-100)',
        },
      }}
      {...ariaProps}
    >
      <IndicatorBar sx={{ opacity: active ? 1 : 0 }} />

      <IconWrapper>{renderIcon(iconColor)}</IconWrapper>

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
    </StyledSettingsTab>
  );
};

export default SettingsTab;
