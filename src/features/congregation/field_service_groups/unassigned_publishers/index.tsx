import { Box, Stack } from '@mui/material';
import { IconVisitors } from '@components/icons';
import Divider from '@components/divider';
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
        position: 'relative',
        padding: '8px',
        gap: '8px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--accent-150)',
        borderRadius: 'var(--radius-xl)',
      }}
    >
      <Box
        component="svg"
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {/* drawn, because a CSS dashed border cannot set the dash length */}
        <Box
          component="rect"
          sx={{
            x: 'calc(var(--dashed-border-width) / 2)',
            y: 'calc(var(--dashed-border-width) / 2)',
            width: 'calc(100% - var(--dashed-border-width))',
            height: 'calc(100% - var(--dashed-border-width))',
            rx: 'var(--radius-xl)',
            fill: 'none',
            stroke: 'var(--accent-300)',
            strokeWidth: 'var(--dashed-border-width)',
            strokeDasharray: 'var(--dashed-border-pattern)',
          }}
        />
      </Box>

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
