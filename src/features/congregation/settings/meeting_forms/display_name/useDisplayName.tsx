import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  displayNameMeetingsEnableState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { personsActiveState } from '@states/persons';
import { generateDisplayName } from '@utils/common';
import { dbPersonsBulkSave } from '@services/dexie/persons';

const useMeetingForms = () => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const meetingInitial = useAtomValue(displayNameMeetingsEnableState);
  const persons = useAtomValue(personsActiveState);

  const [displayNameMeeting, setDisplayNameMeeting] = useState(false);

  const handleDisplayNameMeetingToggle = async () => {
    let displayName = structuredClone(
      settings.cong_settings.display_name_enabled
    );

    if (!Array.isArray(displayName)) {
      const dateA = displayName['meetings']['updatedAt'];
      const dateB = displayName['others']['updatedAt'];
      const meetings = displayName['meetings']['value'];
      const others = displayName['others']['value'];

      displayName = [
        {
          type: 'main',
          updatedAt: dateA > dateB ? dateA : dateB,
          _deleted: false,
          meetings,
          others,
        },
      ];
    }

    const findRecord = displayName.find((record) => record.type === dataView);

    const value = !displayNameMeeting;

    if (findRecord) {
      findRecord.meetings = value;
      findRecord.updatedAt = new Date().toISOString();
    }

    if (!findRecord) {
      displayName.push({
        _deleted: false,
        meetings: value,
        others: false,
        type: dataView,
        updatedAt: new Date().toISOString(),
      });
    }

    await dbAppSettingsUpdate({
      'cong_settings.display_name_enabled': displayName,
    });

    if (value) {
      const personsNoDisplayName = persons.filter(
        (record) => record.person_data.person_display_name.value.length === 0
      );

      const personToUpdate = personsNoDisplayName.map((record) => {
        const person = structuredClone(record);
        person.person_data.person_display_name = {
          value: generateDisplayName(
            record.person_data.person_lastname.value,
            record.person_data.person_firstname.value
          ),
          updatedAt: new Date().toISOString(),
        };

        return person;
      });

      if (personToUpdate.length > 0) {
        await dbPersonsBulkSave(personToUpdate);
      }
    }
  };

  useEffect(() => {
    setDisplayNameMeeting(meetingInitial);
  }, [meetingInitial]);

  return {
    displayNameMeeting,
    handleDisplayNameMeetingToggle,
  };
};

export default useMeetingForms;
