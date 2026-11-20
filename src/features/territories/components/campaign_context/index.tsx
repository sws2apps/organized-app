import { Stack } from '@mui/material';
import { useSearchParams } from 'react-router';
import { useAtomValue } from 'jotai';
import Button from '@components/button';
import InfoNote from '@components/info_note';
import { useAppTranslation } from '@hooks/index';
import { territoryCampaignsState } from '@features/territories/campaigns';
const CampaignContext = () => {
  const { t } = useAppTranslation();
  const [params, setParams] = useSearchParams();
  const campaigns = useAtomValue(territoryCampaignsState);
  const id = params.get('campaign') || params.get('forCampaign');
  if (!id || params.get('tab') === 'campaign') return null;
  const campaign = campaigns.find((item) => item.id === id);
  return (
    <Stack
      direction="row"
      sx={{ alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}
    >
      <InfoNote
        message={
          campaign
            ? t('tr_territoryCampaignContext', { name: campaign.name })
            : t('tr_territoryCampaignUnavailable')
        }
      />
      <Button
        variant="small"
        disableAutoStretch
        onClick={() =>
          setParams((previous) => {
            const next = new URLSearchParams(previous);
            next.delete('campaign');
            next.delete('forCampaign');
            return next;
          })
        }
      >
        {t('tr_territoryShowAllTerritories')}
      </Button>
    </Stack>
  );
};
export default CampaignContext;
