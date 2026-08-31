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
import {
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
      talks: [],
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
    talks: structuredClone(speaker.speaker_data.talks),
  };
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

  const [initial] = useState(() => buildDraft(speaker));
  const [draft, setDraft] = useState(initial);
  const [tab, setTab] = useState(0);
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
  const [pendingRows, setPendingRows] = useState<
    { key: string; songs: number[] }[]
  >([]);

  const isNew = !speaker;

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

  // one row per talk, plus the rows the user has opened but not filled in yet
  const talkRows = useMemo<SpeakerTalkRowType[]>(() => {
    const saved = draft.talks
      .filter((record) => record._deleted === false)
      .flatMap((record) => {
        const talk = publicTalks.find(
          (item) => item.talk_number === record.talk_number
        );

        if (!talk) return [];

        const songs = structuredClone(record.talk_songs).sort((a, b) =>
          a < b ? -1 : 1
        );

        return [{ key: `talk-${record.talk_number}`, talk, songs }];
      });

    const pending = pendingRows.map((record) => ({
      key: record.key,
      talk: null,
      songs: record.songs,
    }));

    return [...saved, ...pending];
  }, [draft.talks, publicTalks, pendingRows]);

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

  const talkUpsert = (talk_number: number, songs: number[]) => {
    setDraft((prev) => {
      const talks = structuredClone(prev.talks);
      const findTalk = talks.find(
        (record) => record.talk_number === talk_number
      );

      if (findTalk) {
        findTalk._deleted = false;
        findTalk.talk_songs = songs;
        findTalk.updatedAt = new Date().toISOString();
      }

      if (!findTalk) {
        talks.push({
          _deleted: false,
          talk_number,
          talk_songs: songs,
          updatedAt: new Date().toISOString(),
        });
      }

      talks.sort((a, b) => (a.talk_number > b.talk_number ? 1 : -1));

      return { ...prev, talks };
    });
  };

  const talkDrop = (talk_number: number) => {
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

  const handleRowAdd = () => {
    setPendingRows((prev) => [
      ...prev,
      { key: crypto.randomUUID(), songs: [] },
    ]);
  };

  const handleRowRemove = (row: SpeakerTalkRowType) => {
    if (row.talk) {
      talkDrop(row.talk.talk_number);
      return;
    }

    setPendingRows((prev) => prev.filter((record) => record.key !== row.key));
  };

  const handleRowTalkChange = (
    row: SpeakerTalkRowType,
    talk: PublicTalkLocaleType | null
  ) => {
    if (row.talk && row.talk.talk_number === talk?.talk_number) return;

    // the row had a talk and it was cleared: keep the songs in an empty row
    if (row.talk && !talk) {
      talkDrop(row.talk.talk_number);
      setPendingRows((prev) => [
        ...prev,
        { key: crypto.randomUUID(), songs: row.songs },
      ]);
      return;
    }

    if (!talk) return;

    if (row.talk) {
      talkDrop(row.talk.talk_number);
    }

    if (!row.talk) {
      setPendingRows((prev) => prev.filter((record) => record.key !== row.key));
    }

    talkUpsert(talk.talk_number, row.songs);
  };

  const handleRowSongsChange = (
    row: SpeakerTalkRowType,
    songs: SongLocaleType[]
  ) => {
    const values = songs.map((record) => record.song_number);

    if (row.talk) {
      talkUpsert(row.talk.talk_number, values);
      return;
    }

    setPendingRows((prev) =>
      prev.map((record) =>
        record.key === row.key ? { ...record, songs: values } : record
      )
    );
  };

  const isDirty = useMemo(() => {
    if (pendingRows.some((record) => record.songs.length > 0)) return true;

    return JSON.stringify(draft) !== JSON.stringify(initial);
  }, [draft, initial, pendingRows]);

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
      'speaker_data.talks': draft.talks,
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
