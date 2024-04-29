import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { displayNameEnableState, fullnameOptionState } from '@states/settings';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { dbVistingSpeakersDelete, dbVistingSpeakersUpdate } from '@services/dexie/visiting_speakers';
import { generateDisplayName } from '@utils/common';
import { publicTalksState } from '@states/public_talks';
import { PublicTalkType } from '@definition/public_talks';

const useEdit = (speaker: VisitingSpeakerType) => {
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const displayNameEnabled = useRecoilValue(displayNameEnableState);
  const publicTalks = useRecoilValue(publicTalksState);

  const [firstname, setFirstname] = useState(speaker.person_firstname.value);
  const [lastname, setLastname] = useState(speaker.person_lastname.value);
  const [email, setEmail] = useState(speaker.person_email.value);
  const [phone, setPhone] = useState(speaker.person_phone.value);
  const [note, setNote] = useState(speaker.person_notes.value);
  const [displayName, setDisplayName] = useState(speaker.person_display_name.value);
  const [addedTalk, setAddedTalk] = useState({} as PublicTalkType);
  const [selectedSongs, setSelectedSongs] = useState<number[]>([]);
  const [openSongAdd, setOpenSongAdd] = useState(false);
  const [openSpeakerDetails, setOpenSpeakerDetails] = useState(false);

  const speakerGender = speaker.elder.value ? 'elder' : speaker.ministerial_servant.value ? 'ms' : '';

  const selectedTalks =
    speaker.talks
      .filter((record) => record._deleted === null)
      .map((record) => {
        const talk = publicTalks.find((item) => item.talk_number === record.talk_number);
        return talk;
      }) || [];

  const handleFirstnameChange = async (value: string) => {
    setFirstname(value);

    await dbVistingSpeakersUpdate(
      { person_firstname: { value: value, updatedAt: new Date().toISOString() } },
      speaker.person_uid
    );

    if (displayNameEnabled) {
      const dispName = generateDisplayName(speaker.person_lastname.value, value);
      setDisplayName(dispName);

      await dbVistingSpeakersUpdate(
        { person_display_name: { value: dispName, updatedAt: new Date().toISOString() } },
        speaker.person_uid
      );
    }
  };

  const handleLastnameChange = async (value: string) => {
    setLastname(value);

    await dbVistingSpeakersUpdate(
      { person_lastname: { value: value, updatedAt: new Date().toISOString() } },
      speaker.person_uid
    );

    if (displayNameEnabled) {
      const dispName = generateDisplayName(value, speaker.person_firstname.value);
      setDisplayName(dispName);

      await dbVistingSpeakersUpdate(
        { person_display_name: { value: dispName, updatedAt: new Date().toISOString() } },
        speaker.person_uid
      );
    }
  };

  const handleDisplayNameChange = async (value: string) => {
    setDisplayName(value);

    await dbVistingSpeakersUpdate(
      { person_display_name: { value: value, updatedAt: new Date().toISOString() } },
      speaker.person_uid
    );
  };

  const handleToggleGender = async (value: string) => {
    if (value === 'elder') {
      await dbVistingSpeakersUpdate(
        {
          elder: { value: true, updatedAt: new Date().toISOString() },
          ministerial_servant: { value: false, updatedAt: new Date().toISOString() },
        },
        speaker.person_uid
      );
    }

    if (value === 'ms') {
      await dbVistingSpeakersUpdate(
        {
          elder: { value: false, updatedAt: new Date().toISOString() },
          ministerial_servant: { value: true, updatedAt: new Date().toISOString() },
        },
        speaker.person_uid
      );
    }
  };

  const handleEmailChange = async (value: string) => {
    setEmail(value);

    await dbVistingSpeakersUpdate(
      { person_email: { value: value, updatedAt: new Date().toISOString() } },
      speaker.person_uid
    );
  };

  const handlePhoneChange = async (value: string) => {
    setPhone(value);

    await dbVistingSpeakersUpdate(
      { person_phone: { value: value, updatedAt: new Date().toISOString() } },
      speaker.person_uid
    );
  };

  const handleNoteChange = async (value: string) => {
    setNote(value);

    await dbVistingSpeakersUpdate(
      { person_notes: { value: value, updatedAt: new Date().toISOString() } },
      speaker.person_uid
    );
  };

  const handleTalksUpdate = async (value: PublicTalkType[]) => {
    const talks = structuredClone(speaker.talks);

    for (const selectedTalk of value) {
      const findTalk = talks.find((record) => record.talk_number === selectedTalk.talk_number);

      if (findTalk && findTalk._deleted !== null) {
        findTalk._deleted = null;
        findTalk.updatedAt = new Date().toISOString();
        setAddedTalk(selectedTalk);
        setSelectedSongs([]);
      }

      if (!findTalk) {
        talks.push({
          _deleted: null,
          talk_number: selectedTalk.talk_number,
          talk_songs: [],
          updatedAt: new Date().toISOString(),
        });
        setAddedTalk(selectedTalk);
        setSelectedSongs([]);
      }
    }

    talks.sort((a, b) => (a.talk_number > b.talk_number ? 1 : -1));

    await dbVistingSpeakersUpdate({ talks }, speaker.person_uid);
    setOpenSongAdd(true);
  };

  const handleTalksDelete = async (talk_number: number) => {
    const talks = structuredClone(speaker.talks);

    const talk = talks.find((record) => record.talk_number === talk_number);
    talk._deleted = new Date().toISOString();

    await dbVistingSpeakersUpdate({ talks }, speaker.person_uid);
  };

  const handleCloseSongAdd = () => setOpenSongAdd(false);

  const handleOpenSpeakerDetails = () => setOpenSpeakerDetails(true);

  const handleCloseSpeakerDetails = () => setOpenSpeakerDetails(false);

  const handleSongsTalkUpdate = async (talk_number: number, songs: number[]) => {
    setSelectedSongs(songs);

    const talks = structuredClone(speaker.talks);
    const findTalk = talks.find((record) => record.talk_number === talk_number);
    findTalk.talk_songs = songs;
    findTalk.updatedAt = new Date().toISOString();

    await dbVistingSpeakersUpdate({ talks }, speaker.person_uid);
  };

  const handleSongsTalkDelete = async (talk_number: number, song: number) => {
    setSelectedSongs((prev) => prev.filter((record) => record !== song));

    const talks = structuredClone(speaker.talks);
    const findTalk = talks.find((record) => record.talk_number === talk_number);
    findTalk.talk_songs = findTalk.talk_songs.filter((record) => record !== song);
    findTalk.updatedAt = new Date().toISOString();

    await dbVistingSpeakersUpdate({ talks }, speaker.person_uid);
  };

  const handleDeleteSpeaker = async (person_uid: string) => {
    await dbVistingSpeakersDelete(person_uid);
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
