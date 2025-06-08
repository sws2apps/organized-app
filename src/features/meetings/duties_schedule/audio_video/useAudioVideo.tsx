import { useAtomValue } from 'jotai';
import { selectedWeekState } from '@states/schedules';

const useAudioVideo = () => {
  const week = useAtomValue(selectedWeekState);

  return { week };
};

export default useAudioVideo;
