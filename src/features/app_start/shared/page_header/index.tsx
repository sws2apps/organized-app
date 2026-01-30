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
          <IconButton sx={{ margin: 0, marginLeft: '-8px' }} onClick={onClick}>
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
