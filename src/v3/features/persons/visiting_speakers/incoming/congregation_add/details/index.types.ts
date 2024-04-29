import { CongregationIncomingDetailsType } from '../index.types';

export type CongregationDetailsType = {
  congregation: CongregationIncomingDetailsType;
  handleCongAddressChange: (value: string) => void;
  handleMidweekWeekdayChange: (value: number) => void;
  handleMidweekTimeChange: (value: Date) => void;
  handleWeekendWeekdayChange: (value: number) => void;
  handleWeekendTimeChange: (value: Date) => void;
  handleTalkCoordinatorNameChange: (value: string) => void;
  handleTalkCoordinatorEmailChange: (value: string) => void;
  handleTalkCoordinatorPhoneChange: (value: string) => void;
  handleCoordinatorNameChange: (value: string) => void;
  handleCoordinatorEmailChange: (value: string) => void;
  handleCoordinatorPhoneChange: (value: string) => void;
  handleIncomingCongregationAdd: VoidFunction;
  handleMovePrevious: VoidFunction;
};
