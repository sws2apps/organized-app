import { Box, IconButton } from '@mui/material';
import { IconArrowBack } from '@icons';
import { Typography } from '@components';

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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { mobile: '8px', laptop: '16px' }, marginBottom: '16px' }}>
        {onClick && (
          <IconButton sx={{ margin: 0, padding: 0 }} onClick={onClick}>
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
