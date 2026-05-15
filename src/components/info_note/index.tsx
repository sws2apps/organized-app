import { Box } from '@mui/material';
import { IconInfo } from '@components/icons';
import { InfoNoteColor, InfoNoteProps } from './index.types';
import Typography from '@components/typography';


const COLOR_MAP: Record<InfoNoteColor, { icon: string; text: string }> = {
  accent: {
    icon: 'var(--accent-400)',
    text: 'var(--accent-400)',
  },
  black: {
    icon: 'var(--black)',
    text: 'var(--grey-400)',
  },
};


const InfoNote = ({
  message,
  children,
  color = 'accent',
  variant = 'inline',
  icon,
  sx,
}: InfoNoteProps) => {
  const { icon: iconColor, text: textColor } = COLOR_MAP[color];

  const iconElement = (
    <Box
      component="span"
      sx={{
        verticalAlign: 'middle',
        display: 'inline-flex',
        marginRight: '6px',
        marginTop: '-2px',
      }}
    >
      {icon ?? <IconInfo color={iconColor} />}
    </Box>
  );

  const content = (
    <Box sx={sx}>
      {message !== undefined ? (
        <Typography
          className="body-small-regular"
          color={textColor}
          sx={{ letterSpacing: '0.1px !important' }}
        >
          {iconElement}
          {message}
        </Typography>
      ) : (
        <Box
          sx={{
            color: textColor,
            // Ensure nested paragraphs (e.g., from <Markup>) display inline
            '& p': {
              display: 'inline',
              margin: 0,
              letterSpacing: '0.1px !important',
            },
          }}
        >
          {iconElement}
          {children}
        </Box>
      )}
    </Box>
  );

  if (variant === 'card') {
    return (
      <Box
        sx={{
          padding: '16px',
          backgroundColor: 'var(--white)',
          border: '1px solid var(--accent-300)',
          borderRadius: 'var(--radius-xl)',
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
};

export default InfoNote;
