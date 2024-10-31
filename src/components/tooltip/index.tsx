import { Box, Grow, Tooltip } from '@mui/material';
import { CustomTooltipProps } from './index.types';

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
const CustomTooltip = (props: CustomTooltipProps) => {
  return props.use ? (
    <Tooltip
      title={props.label}
      enterDelay={props.delaySpeed === 'fast' ? 0 : 2000}
      TransitionComponent={Grow}
      followCursor={props.folowCursor}
      placement={props.placement}
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
      <Box>{props.children}</Box>
    </Tooltip>
  ) : (
    <Box>{props.children}</Box>
  );
};

export default CustomTooltip;
