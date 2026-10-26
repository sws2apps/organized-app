import { Stack } from '@mui/material';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import useCampaignProgress from '@features/territories/components/campaign_progress/useCampaignProgress';

const CampaignProgressCounts = ({ campaignId }: { campaignId: string }) => {
  const { t } = useAppTranslation();
  const progress = useCampaignProgress(campaignId);
  if (!progress)
    return (
      <Typography className="label-small-regular" color="var(--grey-400)">
        {t('tr_territoryCampaignProgressUnavailable')}
      </Typography>
    );
  return (
    <Stack spacing="2px" sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
      <Typography className="body-small-semibold">
        {t('tr_territoryCampaignCompletedCount', progress)}
      </Typography>
      <Typography className="label-small-regular" color="var(--grey-400)">
        {t('tr_territoryCampaignRemainingCounts', progress)}
      </Typography>
    </Stack>
  );
};
export default CampaignProgressCounts;
