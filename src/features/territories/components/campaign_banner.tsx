import { useAppTranslation } from '@hooks/index';
import { ButtonBase, Stack } from '@mui/material';
import { Typography } from '@components/index';
import { IconCampaign } from '@icons/index';
import {
  Territory,
  TerritoryCampaign,
  TerritoryFilters,
} from '@definition/territory';
import { campaignProgress } from '@features/territories/campaign_filter';

// one line while a special campaign runs: how far it is, and the way to
// the territories it has not reached yet
const CampaignBanner = ({
  campaign,
  territories,
  filters,
  onChange,
}: {
  campaign: TerritoryCampaign;
  territories: Territory[];
  filters: TerritoryFilters;
  onChange: (next: TerritoryFilters) => void;
}) => {
  const { t } = useAppTranslation();

  const progress = campaignProgress(territories, campaign.id);

  const showing =
    filters.campaign?.id === campaign.id && !filters.campaign.worked;

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '4px 8px',
        padding: '8px 12px',
        borderRadius: 'var(--radius-l)',
        backgroundColor: 'var(--accent-100)',
      }}
    >
      <IconCampaign color="var(--accent-dark)" width={20} height={20} />

      <Typography className="body-small-semibold" color="var(--accent-dark)">
        {t('tr_territoryOf', {
          campaign: campaign.name,
          done: progress.worked,
          total: progress.total,
        })}
      </Typography>

      {/* the dot stays with the link, so a wrapped line starts with it */}
      <Stack direction="row" spacing="8px" sx={{ alignItems: 'center' }}>
        <Typography className="body-small-regular" color="var(--accent-400)">
          ·
        </Typography>

        <ButtonBase
          disableRipple
          onClick={() =>
            onChange({
              ...filters,
              campaign: showing
                ? undefined
                : { id: campaign.id, worked: false },
            })
          }
          sx={{
            borderRadius: 'var(--radius-s)',
            '&:focus-visible': { outline: 'var(--accent-main) auto 1px' },
          }}
        >
          <Typography
            className="body-small-semibold"
            color="var(--accent-main)"
            sx={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}
          >
            {showing
              ? t('tr_territoryShowAll')
              : t('tr_territoryShowTheOnesNotYetAssigned')}
          </Typography>
        </ButtonBase>
      </Stack>
    </Stack>
  );
};

export default CampaignBanner;
