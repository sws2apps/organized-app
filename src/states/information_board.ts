import { InformationBoardCategory } from '@definition/information_board';
import { informationBoardSchema } from '@services/dexie/schema';
import { atom } from 'jotai';
import { userDataViewState } from './settings';

export const informationBoardState = atom(informationBoardSchema);

export const infoBoardGeneralInformationState = atom((get) => {
  const informationBoard = get(informationBoardState);
  const dataView = get(userDataViewState);

  return (
    informationBoard.information.general_information.find(
      (record) => record.type == dataView
    ) || null
  );
});

export const infoBoardExternalLinksState = atom((get) => {
  const generalInformation = get(infoBoardGeneralInformationState);

  return generalInformation?.external_links;
});

export const infoBoardSWMeetingTimesState = atom((get) => {
  const generalInformation = get(infoBoardGeneralInformationState);

  return generalInformation?.smart_widgets.meeting_times.value ?? false;
});

export const infoBoardSWVideoconferenceInfoState = atom((get) => {
  const generalInformation = get(infoBoardGeneralInformationState);

  return generalInformation?.smart_widgets.videoconference_info.value ?? false;
});

export const infoBoardSWAuxiliaryPioneersState = atom((get) => {
  const generalInformation = get(infoBoardGeneralInformationState);

  return generalInformation?.smart_widgets.auxiliary_pioneers.value ?? false;
});

export const infoBoardSWMonthsOfSpecialActivityState = atom((get) => {
  const generalInformation = get(infoBoardGeneralInformationState);

  return (
    generalInformation?.smart_widgets.months_of_special_activity.value ?? false
  );
});

export const infoBoardAnnouncementsState = atom((get) => {
  const informationBoard = get(informationBoardState);
  const dataView = get(userDataViewState);

  return informationBoard.information.announcements.filter(
    (record) => record.type == dataView
  );
});

export const infoBoardSelectedCategory = atom<InformationBoardCategory>(
  'general_information'
);
