import { InfoBoardGeneralInformationType } from '@definition/information_board';
import { InfoBoardGeneralInformationDraftProps } from '../index.types';
import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { congSpecialMonthsState } from '@states/settings';
import { personsActiveState } from '@states/persons';
import { personIsAP } from '@services/app/persons';

const useInforBoardQSSmartWidgets = (
  props: InfoBoardGeneralInformationDraftProps
) => {
  const specialMonths = useAtomValue(congSpecialMonthsState);
  const activePersons = useAtomValue(personsActiveState);

  const handleSmartWidgetToggle = (
    widget: keyof InfoBoardGeneralInformationType['smart_widgets']
  ) => {
    props.changeDraft((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        smart_widgets: {
          ...prev.smart_widgets,
          [widget]: {
            ...prev.smart_widgets[widget],
            value: !prev.smart_widgets[widget].value,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  };

  const noMonths = useMemo(
    () =>
      specialMonths.length == 0 ||
      !specialMonths.every((year) => year._deleted),
    [specialMonths]
  );

  const pioneersIsExist = useMemo(
    () => activePersons.filter((person) => personIsAP(person)).length !== 0,
    [activePersons]
  );

  return {
    meetingTimes: props.draft?.smart_widgets.meeting_times.value,
    videoconferenceInfo: props.draft?.smart_widgets.videoconference_info.value,
    auxiliaryPioneers: props.draft?.smart_widgets.auxiliary_pioneers.value,
    monthsOfSpecialActivity:
      props.draft?.smart_widgets.months_of_special_activity.value,
    handleSmartWidgetToggle,
    noMonths,
    pioneersIsExist,
  };
};

export default useInforBoardQSSmartWidgets;
