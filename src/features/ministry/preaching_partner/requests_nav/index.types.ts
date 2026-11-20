import { PreachingPartnerTab } from '@definition/preaching_partner';

export type PreachingPartnerNavProps = {
  // absent on the phone list, where no tab is open yet
  value?: PreachingPartnerTab;
  onChange: (value: PreachingPartnerTab) => void;
  enableKeyboardNavigation?: boolean;
};
