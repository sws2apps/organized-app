import { dbVistingSpeakersAdd } from '@services/dexie/visiting_speakers';

const useSpeakersList = () => {
  const handleVisitingSpeakersAdd = async (cong_number: string) => {
    await dbVistingSpeakersAdd(cong_number);
  };

  return { handleVisitingSpeakersAdd };
};

export default useSpeakersList;
