import { InfoBoardGeneralInformationType } from '@definition/information_board';
import { InfoBoardGeneralInformationDraftProps } from '../index.types';

const useInforBoardQSSmartWidgets = (
  props: InfoBoardGeneralInformationDraftProps
) => {
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

  return {
    meetingTimes: props.draft?.smart_widgets.meeting_times.value,
    videoconferenceInfo: props.draft?.smart_widgets.videoconference_info.value,
    auxiliaryPioneers: props.draft?.smart_widgets.auxiliary_pioneers.value,
    monthsOfSpecialActivity:
      props.draft?.smart_widgets.months_of_special_activity.value,
    handleSmartWidgetToggle,
  };
};

export default useInforBoardQSSmartWidgets;
