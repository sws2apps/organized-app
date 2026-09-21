import { Box, Stack } from '@mui/material';
import { Badge, InfoNote, Typography } from '@components/index';
import { publisherLoad } from '../helpers';
import { Territory } from '@definition/territory';
import TruncatedText from './truncated_text';

const PublisherLoad = ({
  territories,
  limit = 10,
}: {
  territories: Territory[];
  limit?: number;
}) => {
  const load = publisherLoad(territories).filter((entry) => entry.count > 0);

  if (load.length === 0) {
    return <InfoNote message="Nothing is assigned." />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {load.slice(0, limit).map((entry, index) => (
        <Stack
          key={entry.publisher}
          direction="row"
          spacing="12px"
          sx={{
            alignItems: 'center',
            padding: '10px 0',
            borderTop: index === 0 ? 'none' : '1px solid var(--accent-200)',
          }}
        >
          <Typography
            className="label-small-medium"
            color="var(--grey-350)"
            sx={{ width: '18px', flexShrink: 0 }}
          >
            {index + 1}
          </Typography>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <TruncatedText
              className="body-small-regular"
              color="var(--grey-400)"
              text={entry.publisher}
            />
          </Box>

          <Box sx={{ width: 'fit-content' }}>
            <Badge
              size="small"
              filled={false}
              color="accent"
              text={String(entry.count)}
            />
          </Box>
        </Stack>
      ))}
    </Box>
  );
};

export default PublisherLoad;
