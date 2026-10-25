import { useAtomValue } from 'jotai';
import { Select, Typography } from '@components/index';
import MenuItem from '@components/menuitem';
import { useAppTranslation } from '@hooks/index';
import { TerritoryAssignment, TerritoryCampaign } from '@definition/territory';
import { territoryCampaignsState } from '@features/territories/campaigns';

type Campaign = TerritoryAssignment['campaign'];
const CampaignPicker = ({
  value,
  onChange,
}: {
  value?: Campaign;
  onChange: (value?: Campaign) => void;
}) => {
  const { t } = useAppTranslation();
  const campaigns = useAtomValue(territoryCampaignsState);
  const options: Pick<TerritoryCampaign, 'id' | 'name'>[] = [...campaigns];
  if (value && !options.some((item) => item.id === value.id))
    options.push(value);
  return (
    <Select
      label={t('tr_territoryAssignmentPurpose')}
      value={value?.id ?? ''}
      onChange={(event) => {
        const campaign = options.find((item) => item.id === event.target.value);
        onChange(
          campaign ? { id: campaign.id, name: campaign.name } : undefined
        );
      }}
    >
      <MenuItem value="">
        <Typography>{t('tr_territoryRegularWork')}</Typography>
      </MenuItem>
      {options.map((campaign) => (
        <MenuItem key={campaign.id} value={campaign.id}>
          <Typography>{campaign.name}</Typography>
        </MenuItem>
      ))}
    </Select>
  );
};
export default CampaignPicker;
