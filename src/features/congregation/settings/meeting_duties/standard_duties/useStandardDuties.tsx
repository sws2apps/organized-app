import { useAtomValue } from 'jotai';
import {
  dutiesAudioVideoCombinedState,
  dutiesMicrophoneSectionsState,
} from '@states/settings';
import { DutyStandard } from './index.types';

const OTHER_DUTIES: DutyStandard[] = [
  'tr_dutiesMicrophones',
  'tr_dutiesStage',
  'tr_dutiesEntranceAttendant',
  'tr_dutiesAuditoriumAttendant',
  'tr_hospitality',
  'tr_dutiesVideoconferenceHost',
];

const useStandardDuties = () => {
  const avCombined = useAtomValue(dutiesAudioVideoCombinedState);

  const sectionsEnabled = useAtomValue(dutiesMicrophoneSectionsState);
  const otherDuties = OTHER_DUTIES.filter(
    (duty) => !sectionsEnabled || duty !== 'tr_dutiesMicrophones'
  );

  // the combined duty is one amount: how many brothers cover audio and video
  const duties: DutyStandard[] = avCombined
    ? ['tr_audioVideo', ...otherDuties]
    : ['tr_dutiesAudio', 'tr_dutiesVideo', ...otherDuties];

  return { duties };
};

export default useStandardDuties;
