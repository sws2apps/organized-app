import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { firstnameState, lastnameState } from '@states/settings';
import useBreakpoints from '@hooks/useBreakpoints';
import useFirebaseAuth from '@hooks/useFirebaseAuth';
import { handleUpdateSetting } from '@services/dexie/settings';

const useUserProfileDetails = () => {
  const { tabletDown } = useBreakpoints();

  const { user } = useFirebaseAuth();

  const userEmail = user?.email || '';

  const firstName = useRecoilValue(firstnameState);
  const lastName = useRecoilValue(lastnameState);

  const [firstNameTmp, setFirstNameTmp] = useState(firstName);
  const [lastNameTmp, setLastNameTmp] = useState(lastName);

  const handleChangeFirstName = async (value) => {
    setFirstNameTmp(value);

    await handleUpdateSetting({ firstname: { value, updatedAt: new Date().toISOString() } });
  };

  const handleChangeLastName = async (value) => {
    setLastNameTmp(value);

    await handleUpdateSetting({ lastname: { value, updatedAt: new Date().toISOString() } });
  };

  return { tabletDown, firstNameTmp, lastNameTmp, handleChangeFirstName, handleChangeLastName, userEmail };
};

export default useUserProfileDetails;
