import { Box, Grow, Tooltip as MUITooltip } from '@mui/material';
import { CustomTooltipProps } from './index.types';
import { cloneElement, ReactElement, useState } from 'react';

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
const Tooltip = ({
  show = true,
  delaySpeed = 'fast',
  variant = 'any',
  icon = { defaultColor: 'var(--black)', hoverColor: 'var(--accent-main)' },
  ...props
}: CustomTooltipProps) => {
  const [iconIsHovered, setIconIsHovered] = useState(false);

  return show ? (
    <MUITooltip
      {...props}
      enterDelay={delaySpeed === 'fast' ? 100 : 2000}
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
      <Box>
        {variant == 'any' ? (
          props.children
        ) : (
          <Box
            onMouseEnter={() => setIconIsHovered(true)}
            onMouseLeave={() => setIconIsHovered(false)}
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {cloneElement(props.children as ReactElement, {
              color: iconIsHovered ? icon.hoverColor : icon.defaultColor,
            })}
          </Box>
        )}
      </Box>
    </MUITooltip>
  ) : (
    props.children
  );
};

export default Tooltip;
