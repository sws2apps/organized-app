import { Grow, Tooltip as MUITooltip } from '@mui/material';
import { CustomTooltipProps } from './index.types';
import { FC } from 'react';

/**
 * CustomTooltip Component
 *
 * A custom-styled tooltip component built on top of MUI's Tooltip, designed to display informative text
 * when users hover over or focus on an element. This component supports configurable delay speeds, cursor tracking,
 * and custom placement, with styling enhancements for improved accessibility and aesthetics.
 *
 * Features:
 * - Adjustable delay based on the provided delaySpeed.
 * - Cursor-following functionality for dynamic tooltip positioning.
 * - Customizable tooltip position to support various UI layouts.
 * - Styled with a consistent color scheme and padding for readability and presentation.
 *
 * @returns {JSX.Element} - Rendered tooltip component surrounding the provided child content.
 */
const Tooltip: FC<CustomTooltipProps> = ({
  show = true,
  delaySpeed = 'fast',
  title,
  enterDelay,
  followCursor,
  children,
}) => {
  const getEnterDelay = () => {
    if (enterDelay) {
      return enterDelay;
    }

    return delaySpeed === 'fast' ? 100 : 800;
  };

  if (!show) return <>{children}</>;

  return (
    <MUITooltip
      title={title}
      followCursor={followCursor}
      enterDelay={getEnterDelay()}
      slots={{ transition: Grow }}
      slotProps={{
        tooltip: {
          sx: {
            backgroundColor: 'var(--grey-400)',
            borderRadius: 'var(--radius-m)',
            padding: '4px 8px 4px 8px',
            maxWidth: '360px',
            color: 'var(--white)',
            fontSize: '12px',
            fontStyle: 'normal',
            border: 'none',
          },
        },
      }}
    >
      {children}
    </MUITooltip>
  );
};

export default Tooltip;
