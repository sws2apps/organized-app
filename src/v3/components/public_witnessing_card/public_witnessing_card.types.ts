import { CPEAccordionProps } from '@components/accordion/accordion.types';

export interface PublicWitnessingPlaceCardProps {
  label: string;
  isEdit?: boolean;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  onClick?: () => void;
  disabled?: boolean;
}

export interface PublicWitnessingTimeCardProps {
  witnesses?: string[];
  needWitnesses?: number;
  minWitnesses?: number;
  isDay?: boolean;
}

export interface PublicWitnessingCardProps extends CPEAccordionProps, PublicWitnessingTimeCardProps {}
export interface PublicWitnessingViewProps extends CPEAccordionProps, PublicWitnessingTimeCardProps {
  isContent: boolean;
}
