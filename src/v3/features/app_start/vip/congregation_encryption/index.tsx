import CongregationMasterKey from './congregation_master_key';
import CongregationPassword from './congregation_password';
import useCongregationEncryption from './useCongregationEncryption';

const CongregationEncryption = () => {
  const { setupMasterKey } = useCongregationEncryption();

  return (
    <>
      {setupMasterKey && <CongregationMasterKey />}
      {!setupMasterKey && <CongregationPassword />}
    </>
  );
};

export default CongregationEncryption;
