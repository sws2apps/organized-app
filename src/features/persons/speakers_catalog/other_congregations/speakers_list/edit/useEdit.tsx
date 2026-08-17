import { useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
} from '@states/settings';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import {
  dbVisitingSpeakersDelete,
  dbVisitingSpeakersUpdate,
} from '@services/dexie/visiting_speakers';
import { generateDisplayName } from '@utils/common';
import { publicTalksLocaleState } from '@states/public_talks';
//fix: i think it was intended to use PublicTalkLocaleType here, but it was importing PublicTalkType which caused errors in index.tsx
//import { PublicTalkType } from '@definition/public_talks';
import { SongType } from '@definition/songs';
import { PublicTalkLocaleType } from '@definition/public_talks';

const useEdit = (speaker: VisitingSpeakerType) => {
  const fullnameOption = useAtomValue(fullnameOptionState);
  const displayNameEnabled = useAtomValue(displayNameMeetingsEnableState);
  const publicTalks = useAtomValue(publicTalksLocaleState);

  const [firstname, setFirstname] = useState(
    speaker.speaker_data.person_firstname.value
  );
  const [lastname, setLastname] = useState(
    speaker.speaker_data.person_lastname.value
  );
  const [email, setEmail] = useState(speaker.speaker_data.person_email.value);
  const [phone, setPhone] = useState(speaker.speaker_data.person_phone.value);
  const [note, setNote] = useState(speaker.speaker_data.person_notes.value);
  const [displayName, setDisplayName] = useState(
    speaker.speaker_data.person_display_name.value
  );
  const [addedTalk, setAddedTalk] = useState({} as PublicTalkLocaleType);
  const [selectedSongs, setSelectedSongs] = useState<number[]>([]);
  const [openSongAdd, setOpenSongAdd] = useState(false);
  const [openSpeakerDetails, setOpenSpeakerDetails] = useState(false);

  const speakerGender = speaker.speaker_data.elder.value
    ? 'elder'
    : speaker.speaker_data.ministerial_servant.value
      ? 'ms'
      : '';

  const selectedTalks =
    speaker.speaker_data.talks
      .filter((record) => record._deleted === false)
      .map((record) => {
        const talk = publicTalks.find(
          (item) => item.talk_number === record.talk_number
        );

        return talk;
      }) || [];

  const handleFirstnameChange = async (value: string) => {
    setFirstname(value);

    await dbVisitingSpeakersUpdate(
      {
        'speaker_data.person_firstname': {
          value: value,
          updatedAt: new Date().toISOString(),
        },
      },
      speaker.person_uid
    );

    const displayNameCurrent = displayName.trim();

    if (!displayNameCurrent && displayNameEnabled) {
      const dispName = generateDisplayName(
        speaker.speaker_data.person_lastname.value,
        value
      );

      setDisplayName(dispName);

      await dbVisitingSpeakersUpdate(
        {
          'speaker_data.person_display_name': {
            value: dispName,
            updatedAt: new Date().toISOString(),
          },
        },
        speaker.person_uid
      );
    }
  };

  const handleLastnameChange = async (value: string) => {
    setLastname(value);

    await dbVisitingSpeakersUpdate(
      {
        'speaker_data.person_lastname': {
          value: value,
          updatedAt: new Date().toISOString(),
        },
      },
      speaker.person_uid
    );

    const displayNameCurrent = displayName.trim();

    if (!displayNameCurrent && displayNameEnabled) {
      const dispName = generateDisplayName(
        value,
        speaker.speaker_data.person_firstname.value
      );

      setDisplayName(dispName);

      await dbVisitingSpeakersUpdate(
        {
          'speaker_data.person_display_name': {
            value: dispName,
            updatedAt: new Date().toISOString(),
          },
        },
        speaker.person_uid
      );
    }
  };

  const handleDisplayNameChange = async (value: string) => {
    setDisplayName(value);

    await dbVisitingSpeakersUpdate(
      {
        'speaker_data.person_display_name': {
          value: value,
          updatedAt: new Date().toISOString(),
        },
      },
      speaker.person_uid
    );
  };

  const handleToggleGender = async (value: string) => {
    if (value === 'elder') {
      await dbVisitingSpeakersUpdate(
        {
          'speaker_data.elder': {
            value: true,
            updatedAt: new Date().toISOString(),
          },
          'speaker_data.ministerial_servant': {
            value: false,
            updatedAt: new Date().toISOString(),
          },
        },
        speaker.person_uid
      );
    }

    if (value === 'ms') {
      await dbVisitingSpeakersUpdate(
        {
          'speaker_data.elder': {
            value: false,
            updatedAt: new Date().toISOString(),
          },
          'speaker_data.ministerial_servant': {
            value: true,
            updatedAt: new Date().toISOString(),
          },
        },
        speaker.person_uid
      );
    }
  };

  const handleEmailChange = async (value: string) => {
    setEmail(value);

    await dbVisitingSpeakersUpdate(
      {
        'speaker_data.person_email': {
          value: value,
          updatedAt: new Date().toISOString(),
        },
      },
      speaker.person_uid
    );
  };

  const handlePhoneChange = async (value: string) => {
    setPhone(value);

    await dbVisitingSpeakersUpdate(
      {
        'speaker_data.person_phone': {
          value: value,
          updatedAt: new Date().toISOString(),
        },
      },
      speaker.person_uid
    );
  };

  const handleNoteChange = async (value: string) => {
    setNote(value);

    await dbVisitingSpeakersUpdate(
      {
        'speaker_data.person_notes': {
          value: value,
          updatedAt: new Date().toISOString(),
        },
      },
      speaker.person_uid
    );
  };

  const handleTalksUpdate = async (value: PublicTalkLocaleType[]) => {
    const talks = structuredClone(speaker.speaker_data.talks);

    for (const selectedTalk of value) {
      const findTalk = talks.find(
        (record) => record.talk_number === selectedTalk.talk_number
      );

      if (findTalk && findTalk._deleted) {
        findTalk._deleted = false;
        findTalk.updatedAt = new Date().toISOString();
        setAddedTalk(selectedTalk);
        setSelectedSongs([]);
      }

      if (!findTalk) {
        talks.push({
          _deleted: false,
          talk_number: selectedTalk.talk_number,
          talk_songs: [],
          updatedAt: new Date().toISOString(),
        });
        setAddedTalk(selectedTalk);
        setSelectedSongs([]);
      }
    }

    talks.sort((a, b) => (a.talk_number > b.talk_number ? 1 : -1));

    await dbVisitingSpeakersUpdate(
      { 'speaker_data.talks': talks },
      speaker.person_uid
    );
    setOpenSongAdd(true);
  };

  const handleTalksDelete = async (talk_number: number) => {
    const talks = structuredClone(speaker.speaker_data.talks);

    const talk = talks.find((record) => record.talk_number === talk_number);
    talk._deleted = true;
    talk.updatedAt = new Date().toISOString();

    await dbVisitingSpeakersUpdate(
      { 'speaker_data.talks': talks },
      speaker.person_uid
    );
  };

  const handleCloseSongAdd = () => setOpenSongAdd(false);

  const handleOpenSpeakerDetails = () => setOpenSpeakerDetails(true);

  const handleCloseSpeakerDetails = () => setOpenSpeakerDetails(false);

  const handleSongsTalkUpdate = async (
    talk_number: number,
    songs: SongType[]
  ) => {
    const selectedSongs = songs.map((record) => record.song_number);

    setSelectedSongs(selectedSongs);

    const talks = structuredClone(speaker.speaker_data.talks);
    const findTalk = talks.find((record) => record.talk_number === talk_number);
    findTalk.talk_songs = selectedSongs;
    findTalk.updatedAt = new Date().toISOString();

    await dbVisitingSpeakersUpdate(
      { 'speaker_data.talks': talks },
      speaker.person_uid
    );
  };

  const handleSongsTalkDelete = async (talk_number: number, song: number) => {
    setSelectedSongs((prev) => prev.filter((record) => record !== song));

    const talks = structuredClone(speaker.speaker_data.talks);
    const findTalk = talks.find((record) => record.talk_number === talk_number);
    findTalk.talk_songs = findTalk.talk_songs.filter(
      (record) => record !== song
    );
    findTalk.updatedAt = new Date().toISOString();

    await dbVisitingSpeakersUpdate(
      { 'speaker_data.talks': talks },
      speaker.person_uid
    );
  };

  const handleDeleteSpeaker = async (person_uid: string) => {
    await dbVisitingSpeakersDelete(person_uid);
  };

  return {
    fullnameOption,
    displayNameEnabled,
    handleFirstnameChange,
    firstname,
    handleLastnameChange,
    lastname,
    handleToggleGender,
    speakerGender,
    email,
    handleEmailChange,
    phone,
    handlePhoneChange,
    note,
    handleNoteChange,
    displayName,
    handleDisplayNameChange,
    selectedTalks,
    publicTalks,
    handleTalksUpdate,
    handleTalksDelete,
    openSongAdd,
    openSpeakerDetails,
    addedTalk,
    selectedSongs,
    handleCloseSongAdd,
    handleOpenSpeakerDetails,
    handleCloseSpeakerDetails,
    handleSongsTalkUpdate,
    handleSongsTalkDelete,
    handleDeleteSpeaker,
  };
};

export default useEdit;
