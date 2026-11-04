import { ReactElement } from 'react';
import {
  IconCart,
  IconGasStation,
  IconNewStar,
  IconNormalPin,
  IconPark,
  IconParking,
  IconPublicTransport,
  IconRestaurant,
  IconSchool,
  IconShoppingCart,
} from '@icons/index';
import { SvgIcon } from '@mui/material';
import { PinType } from '@definition/territory';

// Material Symbols' "account_balance" (Apache 2.0): a public building with
// columns, for a town hall, church or museum the publishers know
const IconLandmark = ({
  color,
  width = 24,
  height = 24,
}: {
  color?: string;
  width?: number;
  height?: number;
}) => (
  <SvgIcon sx={{ width, height }} viewBox="0 0 24 24">
    <path
      fill={color}
      d="M6.5 10h-2v7h2v-7zm6 0h-2v7h2v-7zm8.5 9H2v2h19v-2zm-2.5-9h-2v7h2v-7zm-7-6.74L16.71 6H6.29l5.21-2.74m0-2.26L2 6v2h19V6l-9.5-5z"
    />
  </SvgIcon>
);

const ICONS: Record<
  PinType,
  (props: { color?: string; width?: number; height?: number }) => ReactElement
> = {
  normal: IconNormalPin,
  parking: IconParking,
  restaurant: IconRestaurant,
  transport: IconPublicTransport,
  shop: IconShoppingCart,
  nature: IconPark,
  gas: IconGasStation,
  sight: IconNewStar,
  building: IconLandmark,
  school: IconSchool,
  cart: IconCart,
};

const PinIcon = ({
  type = 'normal',
  color,
  size = 16,
}: {
  type?: PinType;
  color: string;
  size?: number;
}) => {
  const Icon = ICONS[type];

  return <Icon color={color} width={size} height={size} />;
};

export default PinIcon;
