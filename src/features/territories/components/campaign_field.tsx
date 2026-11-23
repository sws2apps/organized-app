import { TerritoryCampaign } from '@definition/territory';
import CampaignPicker from '@features/territories/components/campaign_picker';
export type CampaignRef = Pick<TerritoryCampaign, 'id' | 'name'>;
export type CampaignChoice = { checked: boolean; value?: CampaignRef };
const CampaignField = ({
  checked,
  value,
  onChange,
}: {
  checked: boolean;
  value?: CampaignRef;
  onChange: (next: CampaignChoice) => void;
}) => (
  <CampaignPicker
    value={checked ? value : undefined}
    onChange={(value) => onChange({ checked: !!value, value })}
  />
);
export default CampaignField;
