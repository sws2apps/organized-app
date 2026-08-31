import { useLayoutEffect, useMemo, useState } from 'react';
import { UpdateSpec } from 'dexie';
import { useAtomValue } from 'jotai';
import { AssignmentCode } from '@definition/assignment';
import { PublicTalkLocaleType } from '@definition/public_talks';
import { SongLocaleType } from '@definition/songs';
import {
  SpeakerDraftType,
  SpeakerEditPopupType,
  SpeakerTalkRowType,
  SpeakerTalkStateType,
} from './index.types';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import {
  dbVisitingSpeakersAdd,
  dbVisitingSpeakersLocalCongSpeakerAdd,
  dbVisitingSpeakersUpdate,
} from '@services/dexie/visiting_speakers';
import { generateDisplayName } from '@utils/common';
import { myCongSpeakersState } from '@states/visiting_speakers';
import { personsByViewState } from '@states/persons';
import { publicTalksLocaleState } from '@states/public_talks';
import { speakersCongregationsState } from '@states/speakers_congregations';
import {
  congNameState,
  displayNameMeetingsEnableState,
  fullnameOptionState,
  userDataViewState,
} from '@states/settings';

const buildDraft = (
  speaker: SpeakerEditPopupType['speaker']
): SpeakerDraftType => {
  if (!speaker) {
    return {
      person_uid: '',
      firstname: '',
      lastname: '',
      displayName: '',
      privilege: '',
      email: '',
      phone: '',
      note: '',
    };
  }

  return {
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
  };
};

const buildRows = (
  speaker: SpeakerEditPopupType['speaker']
): SpeakerTalkStateType[] => {
  if (!speaker) return [];

  return speaker.speaker_data.talks
    .filter((record) => record._deleted === false)
    .map((record) => ({
      key: `talk-${record.talk_number}`,
      talk_number: record.talk_number,
      songs: structuredClone(record.talk_songs).sort((a, b) =>
        a < b ? -1 : 1
      ),
    }));
};

const useSpeakerEditPopup = ({
  speaker,
  cong_id,
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
  const congName = useAtomValue(congNameState);
  const congregations = useAtomValue(speakersCongregationsState);

  const [initial] = useState(() => buildDraft(speaker));
  const [draft, setDraft] = useState(initial);
  const [tab, setTab] = useState(0);
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
  const [initialRows] = useState(() => buildRows(speaker));
  const [rows, setRows] = useState(initialRows);

  const isNew = !speaker;

  const congregationName = useMemo(() => {
    if (local) return congName;

    const id = speaker?.speaker_data.cong_id ?? cong_id;

    return (
      congregations.find((record) => record.id === id)?.cong_data.cong_name
        .value ?? ''
    );
  }, [local, speaker, cong_id, congregations, congName]);

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

  const talkRows = useMemo<SpeakerTalkRowType[]>(() => {
    return rows.map((row) => ({
      key: row.key,
      talk:
        publicTalks.find((item) => item.talk_number === row.talk_number) ??
        null,
      songs: row.songs,
    }));
  }, [rows, publicTalks]);

  const [contentElement, setContentElement] = useState<HTMLDivElement | null>(
    null
  );
  const [minHeight, setMinHeight] = useState<number>();

  // the contact info tab sets the floor, so switching tabs does not resize the
  // dialog under the pointer. a callback ref is used so this runs as soon as
  // the panel is in the document
  useLayoutEffect(() => {
    if (!contentElement || tab !== 0) return;

    const height = contentElement.offsetHeight;

    if (height > 0 && height !== minHeight) {
      setMinHeight(height);
    }
  }, [contentElement, tab, minHeight]);

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

  const handleRowAdd = () => {
    setRows((prev) => [
      ...prev,
      { key: crypto.randomUUID(), talk_number: null, songs: [] },
    ]);
  };

  const handleRowRemove = (row: SpeakerTalkRowType) => {
    setRows((prev) => prev.filter((record) => record.key !== row.key));
  };

  // a row keeps its place and its songs, whichever talk is on it
  const handleRowTalkChange = (
    row: SpeakerTalkRowType,
    talk: PublicTalkLocaleType | null
  ) => {
    setRows((prev) =>
      prev.map((record) =>
        record.key === row.key
          ? { ...record, talk_number: talk?.talk_number ?? null }
          : record
      )
    );
  };

  const handleRowSongsChange = (
    row: SpeakerTalkRowType,
    songs: SongLocaleType[]
  ) => {
    const values = songs.map((record) => record.song_number);

    setRows((prev) =>
      prev.map((record) =>
        record.key === row.key ? { ...record, songs: values } : record
      )
    );
  };

  // rows are folded back into the stored talks on save, keeping the entries
  // that were deleted along the way so a sync can still resolve them
  const buildTalks = () => {
    const updatedAt = new Date().toISOString();
    const talks = structuredClone(speaker?.speaker_data.talks ?? []);

    for (const entry of talks) {
      const row = rows.find(
        (record) => record.talk_number === entry.talk_number
      );

      if (!row) {
        if (!entry._deleted) {
          entry._deleted = true;
          entry.updatedAt = updatedAt;
        }

        continue;
      }

      const songsChanged =
        JSON.stringify(entry.talk_songs) !== JSON.stringify(row.songs);

      if (entry._deleted || songsChanged) {
        entry._deleted = false;
        entry.talk_songs = row.songs;
        entry.updatedAt = updatedAt;
      }
    }

    for (const row of rows) {
      if (row.talk_number === null) continue;

      const exists = talks.some(
        (entry) => entry.talk_number === row.talk_number
      );

      if (exists) continue;

      talks.push({
        _deleted: false,
        talk_number: row.talk_number,
        talk_songs: row.songs,
        updatedAt,
      });
    }

    return talks;
  };

  const isDirty = useMemo(() => {
    if (JSON.stringify(rows) !== JSON.stringify(initialRows)) return true;

    return JSON.stringify(draft) !== JSON.stringify(initial);
  }, [draft, initial, rows, initialRows]);

  const isValid = local
    ? draft.person_uid.length > 0
    : draft.firstname.trim().length > 0 || draft.lastname.trim().length > 0;

  const handleClose = () => {
    if (isDirty) {
      setConfirmDiscardOpen(true);
      return;
    }

    onClose();
  };

  const handleKeepEditing = () => setConfirmDiscardOpen(false);

  const handleDiscard = () => {
    setConfirmDiscardOpen(false);
    onClose();
  };

  const handleSave = async () => {
    const updatedAt = new Date().toISOString();

    const changes: UpdateSpec<VisitingSpeakerType> = {
      'speaker_data.talks': buildTalks(),
    };

    if (local && !isNew) {
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

    if (isNew && local) {
      await dbVisitingSpeakersLocalCongSpeakerAdd(
        !outgoing,
        draft.person_uid,
        changes
      );
    }

    if (isNew && !local && cong_id) {
      await dbVisitingSpeakersAdd(cong_id, changes);
    }

    if (!isNew) {
      await dbVisitingSpeakersUpdate(changes, speaker.person_uid);
    }

    onClose();
  };

  return {
    draft,
    congregationName,
    setContentElement,
    minHeight,
    isNew,
    isValid,
    confirmDiscardOpen,
    handleClose,
    handleKeepEditing,
    handleDiscard,
    tab,
    handleTabChange,
    displayNameEnabled,
    fullnameOption,
    publicTalks,
    personsAvailable,
    talkRows,
    handleFirstnameChange,
    handleLastnameChange,
    handleDisplayNameChange,
    handlePrivilegeChange,
    handleEmailChange,
    handlePhoneChange,
    handleNoteChange,
    handlePersonChange,
    handleRowAdd,
    handleRowRemove,
    handleRowTalkChange,
    handleRowSongsChange,
    handleSave,
  };
};

export default useSpeakerEditPopup;
