import {
  infoBoardSWAuxiliaryPioneersState,
  infoBoardSWMeetingTimesState,
  infoBoardSWMonthsOfSpecialActivityState,
} from '@states/information_board';
import { useAtomValue } from 'jotai';

const useGeneralInformation = () => {
  const swAuxiliaryPioneer = useAtomValue(infoBoardSWAuxiliaryPioneersState);
  const swMeetingTimes = useAtomValue(infoBoardSWMeetingTimesState);
  const swMonthsOfSpecialActivity = useAtomValue(
    infoBoardSWMonthsOfSpecialActivityState
  );

  return {
    swAuxiliaryPioneer,
    swMeetingTimes,
    swMonthsOfSpecialActivity,
  };
};

export default useGeneralInformation;
