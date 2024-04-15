import useCongregationCreate from './useCongregationCreate';
import UserAccountCreated from './account_created';
import CongregationInfo from './congregation_info';

const CongregationCreate = () => {
  const { isCreate, setIsCreate } = useCongregationCreate();

  return (
    <>
      {!isCreate && <UserAccountCreated setIsCreate={(value) => setIsCreate(value)} />}
      {isCreate && <CongregationInfo setIsCreate={(value) => setIsCreate(value)} />}
    </>
  );
};

export default CongregationCreate;
