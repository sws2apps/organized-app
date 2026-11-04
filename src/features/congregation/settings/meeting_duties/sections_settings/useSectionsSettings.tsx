import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { meetingDutiesState, userDataViewState } from '@states/settings';
import { dutiesSelectedMeetingState } from '@states/schedules';
import { DutiesMeetingValue } from '@services/app/duties';

const useSectionsSettings = () => {
  const config = useAtomValue(meetingDutiesState);
  const dataView = useAtomValue(userDataViewState);
  const selectedMeeting = useAtomValue(dutiesSelectedMeetingState);
  const [meeting, setMeeting] = useState<DutiesMeetingValue>(selectedMeeting);
  const [open, setOpen] = useState(false);
  return { config, dataView, meeting, setMeeting, open, setOpen };
};
export default useSectionsSettings;
