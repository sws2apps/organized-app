import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { firstnameState, lastnameState } from '@states/settings';
import useBreakpoints from '@hooks/useBreakpoints';
import useFirebaseAuth from '@hooks/useFirebaseAuth';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { congAccountConnectedState } from '@states/app';

const useUserProfileDetails = () => {
  const { tabletDown } = useBreakpoints();

  const { user } = useFirebaseAuth();

  const userEmail = user?.email || '';

  const firstName = useAtomValue(firstnameState);
  const lastName = useAtomValue(lastnameState);
  const isConnected = useAtomValue(congAccountConnectedState);

  const [firstNameTmp, setFirstNameTmp] = useState(firstName);
  const [lastNameTmp, setLastNameTmp] = useState(lastName);

  const handleChangeFirstName = async (value) => {
    setFirstNameTmp(value);

    await dbAppSettingsUpdate({
      'user_settings.firstname': { value, updatedAt: new Date().toISOString() },
    });
  };

  const handleChangeLastName = async (value) => {
    setLastNameTmp(value);

    await dbAppSettingsUpdate({
      'user_settings.lastname': { value, updatedAt: new Date().toISOString() },
    });
  };

  return {
    tabletDown,
    firstNameTmp,
    lastNameTmp,
    handleChangeFirstName,
    handleChangeLastName,
    userEmail,
    isConnected,
  };
};

export default useUserProfileDetails;
