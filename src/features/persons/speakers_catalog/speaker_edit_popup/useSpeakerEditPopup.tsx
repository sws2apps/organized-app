import { useMemo, useState } from 'react';
import { UpdateSpec } from 'dexie';
import { useAtomValue } from 'jotai';
import { AssignmentCode } from '@definition/assignment';
import { PublicTalkLocaleType } from '@definition/public_talks';
import { SongType } from '@definition/songs';
import { SpeakerDraftType, SpeakerEditPopupType } from './index.types';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { dbVisitingSpeakersUpdate } from '@services/dexie/visiting_speakers';
import { generateDisplayName } from '@utils/common';
import { myCongSpeakersState } from '@states/visiting_speakers';
import { personsByViewState } from '@states/persons';
import { publicTalksLocaleState } from '@states/public_talks';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
  userDataViewState,
} from '@states/settings';

const buildDraft = (
  speaker: SpeakerEditPopupType['speaker']
): SpeakerDraftType => ({
  person_uid: speaker.person_uid,
  firstname: speaker.speaker_data.person_firstname.value,
  lastname: speaker.speaker_data.person_lastname.value,
  displayName: speaker.speaker_data.person_display_name.value,
  privilege: speaker.speaker_data.elder.value
    ? 'elder'
    : speaker.speaker_data.ministerial_servant.value
      ? 'ms'
      : '',
  email: speaker.speaker_data.person_email.value,
  phone: speaker.speaker_data.person_phone.value,
  note: speaker.speaker_data.person_notes.value,
  talks: structuredClone(speaker.speaker_data.talks),
});

const useSpeakerEditPopup = ({
  speaker,
  local,
  outgoing,
  onClose,
}: SpeakerEditPopupType) => {
  const displayNameEnabled = useAtomValue(displayNameMeetingsEnableState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const publicTalks = useAtomValue(publicTalksLocaleState);
  const activePersons = useAtomValue(personsByViewState);
  const congSpeakers = useAtomValue(myCongSpeakersState);
  const dataView = useAtomValue(userDataViewState);

  const [draft, setDraft] = useState(() => buildDraft(speaker));
  const [tab, setTab] = useState(0);

  const persons = useMemo(() => {
    return activePersons.filter((record) => {
      const assignments =
        record.person_data.assignments.find((a) => a.type === dataView)
          ?.values ?? [];

      return assignments.includes(AssignmentCode.WM_Speaker);
    });
  }, [activePersons, dataView]);

  const personsAvailable = useMemo(() => {
    return persons.filter(
      (record) =>
        record.person_uid === draft.person_uid ||
        !congSpeakers.some((s) => s.person_uid === record.person_uid)
    );
  }, [persons, congSpeakers, draft.person_uid]);

  const selectedTalks = useMemo(() => {
    return draft.talks
      .filter((record) => record._deleted === false)
      .flatMap((record) => {
        const talk = publicTalks.find(
          (item) => item.talk_number === record.talk_number
        );

        return talk ? [talk] : [];
      });
  }, [draft.talks, publicTalks]);

  const talksWithSongs = useMemo(() => {
    return draft.talks
      .filter((record) => record._deleted === false)
      .flatMap((record) => {
        const talk = publicTalks.find(
          (item) => item.talk_number === record.talk_number
        );

        if (!talk) return [];

        const songs = structuredClone(record.talk_songs).sort((a, b) =>
          a < b ? -1 : 1
        );

        return [{ talk, songs }];
      });
  }, [draft.talks, publicTalks]);

  const handleTabChange = (value: number) => setTab(value);

  const handleFirstnameChange = (value: string) => {
    setDraft((prev) => {
      const displayName =
        displayNameEnabled && prev.displayName.trim().length === 0
          ? generateDisplayName(prev.lastname, value)
          : prev.displayName;

      return { ...prev, firstname: value, displayName };
    });
  };

  const handleLastnameChange = (value: string) => {
    setDraft((prev) => {
      const displayName =
        displayNameEnabled && prev.displayName.trim().length === 0
          ? generateDisplayName(value, prev.firstname)
          : prev.displayName;

      return { ...prev, lastname: value, displayName };
    });
  };

  const handleDisplayNameChange = (value: string) =>
    setDraft((prev) => ({ ...prev, displayName: value }));

  const handlePrivilegeChange = (value: string) =>
    setDraft((prev) => ({
      ...prev,
      privilege: value as SpeakerDraftType['privilege'],
    }));

  const handleEmailChange = (value: string) =>
    setDraft((prev) => ({ ...prev, email: value }));

  const handlePhoneChange = (value: string) =>
    setDraft((prev) => ({ ...prev, phone: value }));

  const handleNoteChange = (value: string) =>
    setDraft((prev) => ({ ...prev, note: value }));

  const handlePersonChange = (value: string) =>
    setDraft((prev) => ({ ...prev, person_uid: value }));

  const handleTalksUpdate = (value: PublicTalkLocaleType[]) => {
    setDraft((prev) => {
      const talks = structuredClone(prev.talks);

      for (const selected of value) {
        const findTalk = talks.find(
          (record) => record.talk_number === selected.talk_number
        );

        if (findTalk) {
          findTalk._deleted = false;
          findTalk.updatedAt = new Date().toISOString();
        }

        if (!findTalk) {
          talks.push({
            _deleted: false,
            talk_number: selected.talk_number,
            talk_songs: [],
            updatedAt: new Date().toISOString(),
          });
        }
      }

      talks.sort((a, b) => (a.talk_number > b.talk_number ? 1 : -1));

      return { ...prev, talks };
    });
  };

  const handleTalksDelete = (talk_number: number) => {
    setDraft((prev) => {
      const talks = structuredClone(prev.talks);
      const findTalk = talks.find(
        (record) => record.talk_number === talk_number
      );

      if (findTalk) {
        findTalk._deleted = true;
        findTalk.updatedAt = new Date().toISOString();
      }

      return { ...prev, talks };
    });
  };

  const handleSongsTalkUpdate = (talk_number: number, songs: SongType[]) => {
    setDraft((prev) => {
      const talks = structuredClone(prev.talks);
      const findTalk = talks.find(
        (record) => record.talk_number === talk_number
      );

      if (findTalk) {
        findTalk.talk_songs = songs.map((record) => record.song_number);
        findTalk.updatedAt = new Date().toISOString();
      }

      return { ...prev, talks };
    });
  };

  const handleSongsTalkDelete = (talk_number: number, song: number) => {
    setDraft((prev) => {
      const talks = structuredClone(prev.talks);
      const findTalk = talks.find(
        (record) => record.talk_number === talk_number
      );

      if (findTalk) {
        findTalk.talk_songs = findTalk.talk_songs.filter(
          (record) => record !== song
        );
        findTalk.updatedAt = new Date().toISOString();
      }

      return { ...prev, talks };
    });
  };

  const handleSave = async () => {
    const updatedAt = new Date().toISOString();

    const changes: UpdateSpec<VisitingSpeakerType> = {
      'speaker_data.talks': draft.talks,
    };

    if (local) {
      if (draft.person_uid !== speaker.person_uid) {
        changes['person_uid'] = draft.person_uid;
        changes['speaker_data.local'] = { value: !outgoing, updatedAt };
      }
    }

    if (!local) {
      changes['speaker_data.person_firstname'] = {
        value: draft.firstname,
        updatedAt,
      };
      changes['speaker_data.person_lastname'] = {
        value: draft.lastname,
        updatedAt,
      };
      changes['speaker_data.person_display_name'] = {
        value: draft.displayName,
        updatedAt,
      };
      changes['speaker_data.elder'] = {
        value: draft.privilege === 'elder',
        updatedAt,
      };
      changes['speaker_data.ministerial_servant'] = {
        value: draft.privilege === 'ms',
        updatedAt,
      };
      changes['speaker_data.person_email'] = { value: draft.email, updatedAt };
      changes['speaker_data.person_phone'] = { value: draft.phone, updatedAt };
      changes['speaker_data.person_notes'] = { value: draft.note, updatedAt };
    }

    await dbVisitingSpeakersUpdate(changes, speaker.person_uid);

    onClose();
  };

  return {
    draft,
    tab,
    handleTabChange,
    displayNameEnabled,
    fullnameOption,
    publicTalks,
    personsAvailable,
    selectedTalks,
    talksWithSongs,
    handleFirstnameChange,
    handleLastnameChange,
    handleDisplayNameChange,
    handlePrivilegeChange,
    handleEmailChange,
    handlePhoneChange,
    handleNoteChange,
    handlePersonChange,
    handleTalksUpdate,
    handleTalksDelete,
    handleSongsTalkUpdate,
    handleSongsTalkDelete,
    handleSave,
  };
};

export default useSpeakerEditPopup;
