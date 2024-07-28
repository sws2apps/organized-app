import CongregationMasterKey from './congregation_master_key';
import CongregationAccessCode from './congregation_access_code';
import useCongregationEncryption from './useCongregationEncryption';

const CongregationEncryption = () => {
  const { setupMasterKey, setupAccessCode } = useCongregationEncryption();

  return (
    <>
      {setupMasterKey && <CongregationMasterKey />}
      {!setupMasterKey && setupAccessCode && <CongregationAccessCode />}
    </>
  );
};

export default CongregationEncryption;
