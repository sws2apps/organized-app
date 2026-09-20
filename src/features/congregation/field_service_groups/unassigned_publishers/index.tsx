import { Box } from '@mui/material';
import { IconVisitors } from '@components/icons';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useUnassignedPublishers from './useUnassignedPublishers';
import PublisherItem from './publisher_item';
import Typography from '@components/typography';

const UnassignedPublishers = () => {
  const { t } = useAppTranslation();

  const { isServiceCommittee } = useCurrentUser();

  const { publishers } = useUnassignedPublishers();

  if (!isServiceCommittee || publishers.length === 0) return null;

  return (
    <Box
      sx={{
        padding: '8px',
        gap: '8px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--accent-150)',
        borderRadius: 'var(--radius-xl)',
        border: '1px dashed var(--accent-350)',
      }}
    >
      <Box
        sx={{
          padding: '8px 16px',
          borderRadius: '6px',
          backgroundColor: 'var(--accent-200)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <Typography className="h3" color="var(--accent-400)">
          {t('tr_publishersWithoutGroup')}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: '4px',
            padding: '2px 8px',
            borderRadius: 'var(--radius-s)',
            alignItems: 'center',
            backgroundColor: 'var(--accent-350)',
          }}
        >
          <IconVisitors color="var(--always-white)" width={16} height={16} />

          <Typography
            className="body-small-semibold"
            color="var(--always-white)"
          >
            {publishers.length}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {publishers.map((publisher) => (
          <PublisherItem key={publisher.person_uid} publisher={publisher} />
        ))}
      </Box>
    </Box>
  );
};

export default UnassignedPublishers;
