import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { fullnameOptionState } from '@states/settings';
import { VisitingSpeakerType } from '@definition/visiting_speakers';

const useView = (speaker: VisitingSpeakerType) => {
  const fullnameOption = useAtomValue(fullnameOptionState);

  const [showDetails, setShowDetails] = useState(false);
  const [openSpeakerDetails, setOpenSpeakerDetails] = useState(false);

  const handleShowDetails = () => setShowDetails(true);

  const handleHideDetails = () => setShowDetails(false);

  const handleOpenSpeakerDetails = () => setOpenSpeakerDetails(true);

  const handleCloseSpeakerDetails = () => setOpenSpeakerDetails(false);

  const talks = speaker.speaker_data.talks
    .filter((record) => record._deleted === false)
    .map((record) => record.talk_number)
    .join(', ');

  return {
    talks,
    fullnameOption,
    showDetails,
    handleShowDetails,
    handleHideDetails,
    openSpeakerDetails,
    handleOpenSpeakerDetails,
    handleCloseSpeakerDetails,
  };
};

export default useView;
