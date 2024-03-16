import { CPEAccordionProps } from '@components/accordion/accordion.types';

export interface PublicWitnessingPlaceCardProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  isDelete?: boolean;
  onDelete?: () => void;
}

export interface PublicWitnessingTimeCardProps {
  witnesses?: string[];
  needWitnesses?: number;
  minWitnesses?: number;
  isDay?: boolean;
}

export interface PublicWitnessingCardProps
  extends Omit<CPEAccordionProps, 'disabled' | 'variant'>,
    PublicWitnessingTimeCardProps {
  isPast?: boolean;
}
export interface PublicWitnessingViewProps extends Omit<CPEAccordionProps, 'disabled'>, PublicWitnessingTimeCardProps {
  isContent: boolean;
  isPast?: boolean;
}
