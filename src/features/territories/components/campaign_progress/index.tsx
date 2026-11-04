import CampaignProgressCounts from '@features/territories/components/campaign_progress/counts';
import { Stack, Box } from '@mui/material';
import { useAtomValue } from 'jotai';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import type { ReactNode } from 'react';
import { appLocaleState } from '@states/app';
import useCampaignProgress from '@features/territories/components/campaign_progress/useCampaignProgress';

const CampaignProgress = ({
  campaignId,
  heading,
  compact = false,
  showCounts = true,
}: {
  campaignId: string;
  heading?: ReactNode;
  compact?: boolean;
  showCounts?: boolean;
}) => {
  const { t } = useAppTranslation();
  const locale = useAtomValue(appLocaleState);
  const progress = useCampaignProgress(campaignId);
  if (!progress)
    return (
      <Stack spacing="8px" sx={{ minWidth: 0 }}>
        {heading}
        {showCounts && <CampaignProgressCounts campaignId={campaignId} />}
      </Stack>
    );
  const { worked, out, waiting, total } = progress;
  const fraction = total > 0 ? worked / total : 0;
  const percent = new Intl.NumberFormat(locale.code, {
    style: 'percent',
    maximumFractionDigits: 0,
  }).format(fraction);
  const completed = t('tr_territoryCampaignCompletedCount', { worked, total });
  const remaining = t('tr_territoryCampaignRemainingCounts', { out, waiting });

  return (
    <Stack
      direction="row"
      spacing={compact ? '12px' : '16px'}
      sx={{
        width: '100%',
        minWidth: 0,
        alignItems: heading ? 'flex-start' : 'center',
      }}
    >
      <Box
        role="progressbar"
        aria-label={t('tr_territoryCampaignProgress')}
        aria-valuemin={0}
        aria-valuemax={total || 1}
        aria-valuenow={worked}
        aria-valuetext={`${completed} · ${remaining}`}
        sx={{
          position: 'relative',
          width: compact ? '44px' : '64px',
          height: compact ? '44px' : '64px',
          flexShrink: 0,
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 64 64" aria-hidden="true">
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="var(--accent-150)"
            strokeWidth="6"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="var(--accent-main)"
            strokeWidth="6"
            pathLength="100"
            strokeDasharray={`${fraction * 100} 100`}
            transform="rotate(-90 32 32)"
          />
        </svg>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Typography
            className={compact ? 'label-small-medium' : 'body-small-semibold'}
            sx={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {percent}
          </Typography>
        </Box>
      </Box>
      <Stack spacing="2px" sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
        {heading}
        {showCounts && <CampaignProgressCounts campaignId={campaignId} />}
      </Stack>
    </Stack>
  );
};
export default CampaignProgress;
