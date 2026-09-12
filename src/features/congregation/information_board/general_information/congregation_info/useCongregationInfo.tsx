import { infoBoardGeneralInformationState } from '@states/information_board';
import { congAddressState, congNameState } from '@states/settings';
import { useAtomValue } from 'jotai';

const useCongregationInfo = () => {
  const congName = useAtomValue(congNameState);
  const congAddress = useAtomValue(congAddressState);
  const generalInformation = useAtomValue(infoBoardGeneralInformationState);

  return {
    congName,
    congAddress,
    externalLinks: generalInformation?.external_links,
  };
};

export default useCongregationInfo;
