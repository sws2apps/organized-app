import { Box } from '@mui/material';
import { IconInfo } from '@components/icons';
import { InfoNoteProps } from './index.types';
import Typography from '@components/typography';


const InfoNote = ({
  message,
  children,
  variant = 'inline',
  icon,
  sx,
}: InfoNoteProps) => {
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
      {icon ?? <IconInfo color="var(--accent-400)" />}
    </Box>
  );

  const content = message === undefined ? (
    <Box
      sx={{
        color: 'var(--accent-400)',
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
      color="var(--accent-400)"
      sx={{ letterSpacing: '0px !important' }}
    >
      {iconElement}
      {message}
    </Typography>
  );

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
