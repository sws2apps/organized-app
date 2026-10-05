import {
  InformationBoardCategory,
  InfoBoardGeneralInformationType,
} from '@definition/information_board';
import { informationBoardSchema } from '@services/dexie/schema';
import { atom } from 'jotai';
import { userDataViewState } from './settings';

export const informationBoardState = atom(informationBoardSchema);

export const infoBoardGeneralInformationState = atom(
  (get) => {
    const informationBoard = get(informationBoardState);
    const dataView = get(userDataViewState);

    return (
      informationBoard.information.general_information.find(
        (record) => record.type == dataView
      ) || null
    );
  },
  (get, set, value: InfoBoardGeneralInformationType | null) => {
    if (!value) return;

    const informationBoard = get(informationBoardState);
    const dataView = get(userDataViewState);

    set(informationBoardState, {
      ...informationBoard,
      information: {
        ...informationBoard.information,
        general_information:
          informationBoard.information.general_information.map((record) =>
            record.type == dataView ? value : record
          ),
      },
    });
  }
);

export const infoBoardExternalLinksState = atom((get) => {
  const generalInformation = get(infoBoardGeneralInformationState);

  return generalInformation?.external_links;
});

export const infoBoardSWMeetingTimesState = atom(
  (get) => {
    const generalInformation = get(infoBoardGeneralInformationState);

    return generalInformation?.smart_widgets.meeting_times.value ?? false;
  },
  (get, set, value: boolean) => {
    const generalInformation = get(infoBoardGeneralInformationState);

    if (!generalInformation) return;

    set(infoBoardGeneralInformationState, {
      ...generalInformation,
      smart_widgets: {
        ...generalInformation.smart_widgets,
        meeting_times: {
          ...generalInformation.smart_widgets.meeting_times,
          value,
        },
      },
    });
  }
);

export const infoBoardSWVideoconferenceInfoState = atom(
  (get) => {
    const generalInformation = get(infoBoardGeneralInformationState);

    return (
      generalInformation?.smart_widgets.videoconference_info.value ?? false
    );
  },
  (get, set, value: boolean) => {
    const generalInformation = get(infoBoardGeneralInformationState);

    if (!generalInformation) return;

    set(infoBoardGeneralInformationState, {
      ...generalInformation,
      smart_widgets: {
        ...generalInformation.smart_widgets,
        videoconference_info: {
          ...generalInformation.smart_widgets.videoconference_info,
          value,
        },
      },
    });
  }
);

export const infoBoardSWAuxiliaryPioneersState = atom(
  (get) => {
    const generalInformation = get(infoBoardGeneralInformationState);

    return generalInformation?.smart_widgets.auxiliary_pioneers.value ?? false;
  },
  (get, set, value: boolean) => {
    const generalInformation = get(infoBoardGeneralInformationState);

    if (!generalInformation) return;

    set(infoBoardGeneralInformationState, {
      ...generalInformation,
      smart_widgets: {
        ...generalInformation.smart_widgets,
        auxiliary_pioneers: {
          ...generalInformation.smart_widgets.auxiliary_pioneers,
          value,
        },
      },
    });
  }
);

export const infoBoardSWMonthsOfSpecialActivityState = atom(
  (get) => {
    const generalInformation = get(infoBoardGeneralInformationState);

    return (
      generalInformation?.smart_widgets.months_of_special_activity.value ??
      false
    );
  },
  (get, set, value: boolean) => {
    const generalInformation = get(infoBoardGeneralInformationState);

    if (!generalInformation) return;

    set(infoBoardGeneralInformationState, {
      ...generalInformation,
      smart_widgets: {
        ...generalInformation.smart_widgets,
        months_of_special_activity: {
          ...generalInformation.smart_widgets.months_of_special_activity,
          value,
        },
      },
    });
  }
);

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

export const infoBoardAddAnnouncementState = atom<{
  open: boolean;
  announcementId: string | null;
}>({
  open: false,
  announcementId: null,
});
