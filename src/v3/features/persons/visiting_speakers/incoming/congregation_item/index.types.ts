import { SpeakersCongregationsType } from '@definition/speakers_congregations';

export type IncomingCongregationType = {
  congregation: SpeakersCongregationsType;
  currentExpanded: string;
  onChangeCurrentExpanded: (value: string) => void;
};

export type useListType = {
  cong_number: string;
  currentExpanded: string;
  onChangeCurrentExpanded: (value: string) => void;
};
