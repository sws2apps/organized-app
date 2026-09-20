import { Box, Stack } from '@mui/material';
import { IconVisitors } from '@components/icons';
import Divider from '@components/divider';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useUnassignedPublishers from './useUnassignedPublishers';
import PublisherItem from './publisher_item';
import Typography from '@components/typography';

const DASHED_BORDER = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' rx='16' ry='16' fill='none' stroke='%23000' stroke-width='2' stroke-dasharray='10 8'/%3E%3C/svg%3E")`;

const UnassignedPublishers = () => {
  const { t } = useAppTranslation();

  const { isServiceCommittee } = useCurrentUser();

  const { publishers } = useUnassignedPublishers();

  if (!isServiceCommittee || publishers.length === 0) return null;

  return (
    <Box
      sx={{
        position: 'relative',
        padding: '8px',
        gap: '8px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--accent-150)',
        borderRadius: 'var(--radius-xl)',
        border: '1px dashed var(--accent-300)',
        // a drawn border keeps the 1px of the other cards with longer dashes
        '@supports (mask-image: url())': {
          border: 'none',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundColor: 'var(--accent-300)',
            maskImage: DASHED_BORDER,
            WebkitMaskImage: DASHED_BORDER,
          },
        },
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
          {t('tr_withoutGroup')}
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

      <Stack spacing="4px" divider={<Divider color="var(--accent-200)" />}>
        {publishers.map((publisher) => (
          <PublisherItem key={publisher.person_uid} publisher={publisher} />
        ))}
      </Stack>
    </Box>
  );
};

export default UnassignedPublishers;
