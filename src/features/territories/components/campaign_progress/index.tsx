import { Stack } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router';
import Button from '@components/button';
import Typography from '@components/typography';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { territoriesState } from '@states/territories';

const CampaignProgress = ({ campaignId }: { campaignId: string }) => {
  const { t } = useAppTranslation();
  const { isElder, isServiceCommittee } = useCurrentUser();
  const territories = useAtomValue(territoriesState);
  const navigate = useNavigate();
  if (!isElder && !isServiceCommittee) return null;
  let worked = 0;
  let out = 0;
  for (const territory of territories) {
    const assignments = territory.assignments.filter(
      (item) => item.campaign?.id === campaignId
    );
    if (assignments.some((item) => item.returnedOn && item.completed !== false))
      worked += 1;
    else if (assignments.some((item) => !item.returnedOn)) out += 1;
  }
  return (
    <Stack spacing={1}>
      <Typography className="h3">
        {t('tr_territoryCampaignProgress')}
      </Typography>
      <Typography>
        {t('tr_territoryCampaignCounts', {
          worked,
          out,
          total: territories.length,
        })}
      </Typography>
      <Typography className="body-small-regular" color="var(--grey-400)">
        {t('tr_territoryCampaignHistoryHelp')}
      </Typography>
      <Button
        variant="main"
        onClick={() =>
          navigate(
            `/territories?tab=all&forCampaign=${encodeURIComponent(campaignId)}`
          )
        }
      >
        {t('tr_territoryAssignTerritories')}
      </Button>
      <Button
        variant="small"
        onClick={() =>
          navigate(
            `/territories?tab=all&campaign=${encodeURIComponent(campaignId)}`
          )
        }
      >
        {t('tr_territoryCampaignAssignments')}
      </Button>
    </Stack>
  );
};
export default CampaignProgress;
