import { Box } from '@mui/material';
import { IconInfo } from '@components/icons';
import { InfoNoteProps } from './index.types';
import Typography from '@components/typography';

const InfoNote = ({
  message,
  children,
  variant = 'inline',
  showIcon = true,
  label,
  preserveWhitespace = false,
  icon,
  sx,
}: InfoNoteProps) => {
  const color =
    variant === 'subtle' ? 'var(--text-muted)' : 'var(--accent-400)';
  const iconElement = showIcon ? (
    <Box
      component="span"
      sx={{
        verticalAlign: 'middle',
        display: 'inline-flex',
        marginRight: '6px',
        marginTop: '-2px',
      }}
    >
      {icon ?? <IconInfo color="var(--accent-400)" />}
    </Box>
  ) : null;

  const content =
    message === undefined ? (
      <Box
        sx={{
          color,
          minWidth: 0,
          overflowWrap: 'anywhere',
          whiteSpace: preserveWhitespace ? 'pre-wrap' : undefined,
          // Ensure nested paragraphs (e.g., from <Markup>) display inline
          '& p': {
            display: 'inline',
            margin: 0,
            letterSpacing: '0px !important',
          },
        }}
      >
        {iconElement}
        {children}
      </Box>
    ) : (
      <Typography
        className="body-small-regular"
        sx={{
          color,
          minWidth: 0,
          overflowWrap: 'anywhere',
          whiteSpace: preserveWhitespace ? 'pre-wrap' : undefined,
          letterSpacing: '0px !important',
        }}
      >
        {iconElement}
        {message}
      </Typography>
    );

  if (variant === 'subtle') {
    return (
      <Box
        role="note"
        aria-label={label}
        sx={[
          {
            minWidth: 0,
            padding: 'var(--note-padding)',
            backgroundColor: 'var(--note-background)',
            borderRadius: 'var(--radius-l)',
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {content}
      </Box>
    );
  }

  if (variant === 'card') {
    return (
      <Box
        sx={[
          {
            padding: '16px',
            backgroundColor: 'var(--white)',
            border: '1px solid var(--accent-300)',
            borderRadius: 'var(--radius-xl)',
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {content}
      </Box>
    );
  }

  return <Box sx={sx}>{content}</Box>;
};

export default InfoNote;
