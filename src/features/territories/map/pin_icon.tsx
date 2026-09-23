import {
  IconCart,
  IconGasStation,
  IconHome,
  IconNewStar,
  IconNormalPin,
  IconPark,
  IconParking,
  IconPublicTransport,
  IconRestaurant,
  IconSchool,
  IconShoppingCart,
} from '@icons/index';
import { PinType } from '@definition/territory';

const ICONS: Record<PinType, typeof IconNormalPin> = {
  normal: IconNormalPin,
  parking: IconParking,
  restaurant: IconRestaurant,
  transport: IconPublicTransport,
  shop: IconShoppingCart,
  nature: IconPark,
  gas: IconGasStation,
  sight: IconNewStar,
  building: IconHome,
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
