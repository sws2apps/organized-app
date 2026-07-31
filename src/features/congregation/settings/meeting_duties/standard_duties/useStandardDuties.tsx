import { useAtomValue } from 'jotai';
import { dutiesAudioVideoCombinedState } from '@states/settings';
import { DutyStandard } from './index.types';

const OTHER_DUTIES: DutyStandard[] = [
  'tr_dutiesMicrophones',
  'tr_dutiesStage',
  'tr_dutiesEntranceAttendant',
  'tr_hospitality',
];

const useStandardDuties = () => {
  const avCombined = useAtomValue(dutiesAudioVideoCombinedState);

  // the combined duty is one amount: how many brothers cover audio and video
  const duties: DutyStandard[] = avCombined
    ? ['tr_audioVideo', ...OTHER_DUTIES]
    : ['tr_dutiesAudio', 'tr_dutiesVideo', ...OTHER_DUTIES];

  return { duties };
};

export default useStandardDuties;
