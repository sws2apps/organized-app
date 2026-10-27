import { Box, Stack } from '@mui/material';
import { useAtomValue } from 'jotai';
import { FilterChip, Select, Typography } from '@components/index';
import MenuItem from '@components/menuitem';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { appLocaleState } from '@states/app';
import { territoryCampaignsState } from '@features/territories/campaigns';
import {
  campaignLabel,
  campaignRange,
} from '@features/territories/campaign_dates';
import {
  campaignSections,
  CAMPAIGN_STATUSES,
  CampaignStatus,
} from '@features/territories/campaign_view';
import { campaignProgress } from '@features/territories/campaign_filter';
import CampaignProgress from '@features/territories/components/campaign_progress';
import { Territory, TerritoryCampaign } from '@definition/territory';

const LABELS: Record<CampaignStatus, string> = {
  all: 'tr_territoryCampaignAllStatus',
  waiting: 'tr_territoryCampaignNotStarted',
  assigned: 'tr_territoryCampaignAssignedStatus',
  completed: 'tr_territoryCampaignCompletedStatus',
};
const CampaignBrowser = ({
  campaign,
  status,
  territories,
  onChange,
}: {
  campaign?: TerritoryCampaign;
  status: CampaignStatus;
  territories: Territory[];
  onChange: (id: string, status?: CampaignStatus) => void;
}) => {
  const { t } = useAppTranslation();
  const { tablet600Up } = useBreakpoints();
  const campaigns = useAtomValue(territoryCampaignsState);
  const locale = useAtomValue(appLocaleState);
  const sections = campaignSections(campaigns);
  const progress = campaignProgress(territories, campaign?.id ?? '');
  const counts = {
    all: progress.total,
    waiting: progress.waiting,
    assigned: progress.out,
    completed: progress.worked,
  };
  return (
    <Stack spacing="16px" sx={{ paddingBlock: '16px' }}>
      <Stack
        direction={tablet600Up ? 'row' : 'column'}
        sx={{ gap: '16px', alignItems: 'flex-start' }}
      >
        <Select
          sx={{ minWidth: 0, flex: 1, width: tablet600Up ? 'auto' : '100%' }}
          renderValue={() => (
            <Typography noWrap title={campaign?.name}>
              {campaign?.name}
            </Typography>
          )}
          helperText={
            campaign ? campaignRange(campaign, locale.code) : undefined
          }
          label={t('tr_territoryCampaignTab')}
          value={campaign?.id ?? ''}
          onChange={(event) => onChange(String(event.target.value))}
        >
          {[...sections.active, ...sections.past].map((item) => (
            <MenuItem key={item.id} value={item.id}>
              <Typography
                sx={{ whiteSpace: 'normal', overflowWrap: 'anywhere' }}
              >
                {campaignLabel(item, locale.code)}
              </Typography>
            </MenuItem>
          ))}
        </Select>
        {campaign && (
          <Box
            sx={{
              minWidth: 0,
              flex: tablet600Up ? '0 1 45%' : undefined,
              width: tablet600Up ? 'auto' : '100%',
            }}
          >
            <CampaignProgress campaignId={campaign.id} compact />
          </Box>
        )}
      </Stack>
      {campaign && (
        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: '8px' }}>
          {CAMPAIGN_STATUSES.map((item) => (
            <FilterChip
              key={item}
              label={`${t(LABELS[item])}: ${counts[item]}`}
              selected={status === item}
              onClick={() => onChange(campaign.id, item)}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
};
export default CampaignBrowser;
