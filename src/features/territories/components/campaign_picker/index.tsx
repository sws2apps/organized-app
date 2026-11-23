import { Box, Stack } from '@mui/material';
import { useAtomValue } from 'jotai';
import { Select, Typography } from '@components/index';
import SwitchWithLabel from '@components/switch_with_label';
import MenuItem from '@components/menuitem';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { TerritoryAssignment } from '@definition/territory';
import { appLocaleState } from '@states/app';
import { campaignLabel } from '@features/territories/campaign_dates';
import useCampaignPicker from '@features/territories/components/campaign_picker/useCampaignPicker';

type Campaign = TerritoryAssignment['campaign'];
const CampaignPicker = ({
  value,
  onChange,
}: {
  value?: Campaign;
  onChange: (value?: Campaign) => void;
}) => {
  const { t } = useAppTranslation();
  const { tablet600Up } = useBreakpoints();
  const locale = useAtomValue(appLocaleState);
  const { options, displayed, canEnable, handleToggle, handleSelect } =
    useCampaignPicker(value, onChange);

  return (
    <Stack
      direction={tablet600Up ? 'row' : 'column'}
      spacing="16px"
      sx={{ alignItems: 'flex-start', minWidth: 0, width: '100%' }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          minHeight: '44px',
          flexShrink: 0,
          width: tablet600Up ? 'auto' : '100%',
        }}
      >
        <SwitchWithLabel
          label={t('tr_territoryAssignmentPurpose')}
          checked={!!value}
          onChange={handleToggle}
          readOnly={!canEnable}
          helper={!canEnable ? t('tr_territoryCampaignsEmpty') : undefined}
          inputProps={{
            'aria-label': t('tr_territoryAssignmentPurpose'),
            disabled: !canEnable,
          }}
        />
      </Box>
      <Box
        aria-hidden={!value}
        sx={{
          minWidth: 0,
          flex: 1,
          width: '100%',
          visibility: value ? 'visible' : 'hidden',
        }}
      >
        <Select
          disabled={!value}
          renderValue={() => (
            <Typography noWrap title={displayed?.name ?? ''}>
              {displayed?.name ?? ''}
            </Typography>
          )}
          label={t('tr_territoryCampaignName')}
          value={displayed?.id ?? ''}
          onChange={(event) => handleSelect(String(event.target.value))}
        >
          {options.map((campaign) => (
            <MenuItem key={campaign.id} value={campaign.id}>
              <Typography
                sx={{ whiteSpace: 'normal', overflowWrap: 'anywhere' }}
              >
                {campaignLabel(campaign, locale.code)}
              </Typography>
            </MenuItem>
          ))}
          {displayed && !options.some((item) => item.id === displayed.id) && (
            <MenuItem value={displayed.id}>
              <Typography>{displayed.name}</Typography>
            </MenuItem>
          )}
        </Select>
      </Box>
    </Stack>
  );
};
export default CampaignPicker;
