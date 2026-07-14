import { Box, ButtonBase } from '@mui/material';
import { IconClickerMode } from '@components/icons';
import { ClickerSuggestionProps } from './index.types';

/**
 * "Clicker mode" suggestion, anchored directly under the focused count field.
 * Stays mounted and animates between shown/hidden via `open` — sliding up + in
 * when a field is focused, and down + out (fade to the bottom) when it isn't.
 */
const ClickerSuggestion = ({ open, onOpen, label }: ClickerSuggestionProps) => {
  return (
    <ButtonBase
      disableRipple
      tabIndex={open ? 0 : -1}
      aria-hidden={!open}
      // Keep the focused field from blurring on press so the click can open.
      onMouseDown={(event) => event.preventDefault()}
      onPointerDown={(event) => event.preventDefault()}
      onClick={onOpen}
      sx={{
        position: 'absolute',
        // Sits tight against the field's bottom edge so it clearly belongs to it.
        top: 'calc(100% + 2px)',
        // Centered under the field: at least field-width, growing to fit a
        // longer word up to 30% past it, then the label ellipsis takes over.
        left: '50%',
        width: 'max-content',
        minWidth: '100%',
        maxWidth: '130%',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '9px 16px',
        borderRadius: 'var(--radius-l)',
        backgroundColor: 'var(--accent-main)',
        color: 'var(--always-white)',
        boxShadow: '0px 4px 16px rgba(var(--accent-main-base), 0.4)',
        fontFamily: 'inherit',
        fontSize: '13px',
        fontWeight: 600,
        lineHeight: '18px',
        opacity: open ? 1 : 0,
        transform: open
          ? 'translateX(-50%) translateY(0)'
          : 'translateX(-50%) translateY(8px)',
        pointerEvents: open ? 'auto' : 'none',
        transition:
          'opacity 0.22s ease, transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
        '& svg, & svg g, & svg g path': { fill: 'var(--always-white)' },
        '&:active': { transform: 'translateX(-50%) translateY(0) scale(0.98)' },
        '&:focus-visible': { outline: 'var(--always-white) auto 1px' },
      }}
    >
      <Box component="span" sx={{ display: 'inline-flex', flexShrink: 0 }}>
        <IconClickerMode color="var(--always-white)" width={20} height={20} />
      </Box>
      {/* Truncate with an ellipsis so long translations never overflow the
          field-width button. */}
      <Box
        component="span"
        sx={{
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </Box>
    </ButtonBase>
  );
};

export default ClickerSuggestion;
