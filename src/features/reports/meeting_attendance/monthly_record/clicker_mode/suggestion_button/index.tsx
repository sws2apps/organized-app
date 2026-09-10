import { Box, ButtonBase } from '@mui/material';
import { IconClickerMode } from '@components/icons';
import { ClickerSuggestionProps } from './index.types';

const ClickerSuggestion = ({ open, onOpen, label }: ClickerSuggestionProps) => {
  return (
    <ButtonBase
      disableRipple
      tabIndex={open ? 0 : -1}
      aria-hidden={!open}
      // Keep the field focused on press so the click can open the overlay.
      onMouseDown={(event) => event.preventDefault()}
      onPointerDown={(event) => event.preventDefault()}
      onClick={onOpen}
      sx={{
        position: 'absolute',
        top: 'calc(100% + 2px)',
        // Field-width, growing up to 30% for a longer word, then ellipsis.
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
