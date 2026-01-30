import { Box, IconButton } from '@mui/material';
import { IconArrowBack } from '@icons/index';
import Typography from '@components/typography';

const PageHeader = ({
  title,
  description,
  onClick,
}: {
  title: string;
  description?: string;
  onClick?: VoidFunction;
}) => {
  return (
    <Box sx={{ marginBottom: '32px' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { mobile: '8px', laptop: '16px' },
          marginBottom: '16px',
        }}
      >
        {onClick && (
          <IconButton
            sx={{
              margin: 0,
              marginLeft: '-8px',
              '&:hover': {
                backgroundColor: 'var(--accent-200)',
                '& svg': {
                  animation:
                    'backButtonBounce 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                },
              },
              '& svg': {
                transition: 'transform 0.3s ease-out',
              },
              '@keyframes backButtonBounce': {
                '0%': { transform: 'translateX(0)' },
                '30%': { transform: 'translateX(3px)' },
                '100%': { transform: 'translateX(-2px)' },
              },
            }}
            onClick={onClick}
          >
            <IconArrowBack color="var(--black)" />
          </IconButton>
        )}

        <Typography className="h1" color="var(--black)">
          {title}
        </Typography>
      </Box>
      {description && (
        <Typography className="body-regular" color="var(--grey-400)">
          {description}
        </Typography>
      )}
    </Box>
  );
};

export default PageHeader;
