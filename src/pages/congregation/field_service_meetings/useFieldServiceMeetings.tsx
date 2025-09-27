import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useCurrentUser } from '@hooks/index';
import { FieldServiceMeetingType } from '@definition/field_service_meetings';
import { dbFieldServiceMeetingsSave } from '@services/dexie/field_service_meetings';
import { fieldServiceMeetingsActiveState } from '@states/field_service_meetings';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';

const useFieldServiceMeetings = () => {
  const { isAdmin } = useCurrentUser();
  const fieldServiceMeetings = useAtomValue(fieldServiceMeetingsActiveState);
  const [addMeetingBoxShow, setAddMeetingBoxShow] = useState(false);

  const meetings = useMemo(() => {
    return fieldServiceMeetings.filter((record) => {
      // Adapt filter logic as needed for your app
      return !record._deleted;
    });
  }, [fieldServiceMeetings]);

  const emptyMeeting: FieldServiceMeetingType = {
    meeting_uid: crypto.randomUUID(),
    _deleted: false,
    updatedAt: new Date().toISOString(),
    meeting_data: {
      _deleted: false,
      updatedAt: new Date().toISOString(),
      start: new Date().toISOString(),
      end: new Date().toISOString(),
      type: '',
      category: 0,
      conductor: '',
      location: 0,
      group: '',
      address: '',
      additionalInfo: '',
      custom: '',
    },
  };

  const handleShowAddMeetingBox = () => {
    setAddMeetingBoxShow(true);
  };

  const handleHideAddMeetingBox = () => {
    setAddMeetingBoxShow(false);
  };

  const handleAddMeetingButtonClick = () => {
    handleShowAddMeetingBox();
  };

  const handleSaveMeeting = async (meeting: FieldServiceMeetingType) => {
    try {
      await dbFieldServiceMeetingsSave(meeting);
      handleHideAddMeetingBox();
    } catch (error) {
      console.error(error);
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: error instanceof Error ? error.message : String(error),
        severity: 'error',
      });
    }
  };

  return {
    isAdmin,
    emptyMeeting,
    meetings,
    addMeetingBoxShow,
    handleSaveMeeting,
    handleHideAddMeetingBox,
    handleAddMeetingButtonClick,
  };
};

export default useFieldServiceMeetings;
