import { useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  firstnameState,
  lastnameState,
  middlenameState,
} from '@states/settings';
import useBreakpoints from '@hooks/useBreakpoints';
import useFirebaseAuth from '@hooks/useFirebaseAuth';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { congAccountConnectedState } from '@states/app';

const useUserProfileDetails = () => {
  const { tabletDown } = useBreakpoints();

  const { user } = useFirebaseAuth();

  const userEmail = user?.email || '';

  const firstName = useAtomValue(firstnameState);
  const middleName = useAtomValue(middlenameState);
  const lastName = useAtomValue(lastnameState);
  const isConnected = useAtomValue(congAccountConnectedState);

  const [firstNameTmp, setFirstNameTmp] = useState(firstName);
  const [middleNameTmp, setMiddleNameTmp] = useState(middleName);
  const [lastNameTmp, setLastNameTmp] = useState(lastName);

  const handleChangeFirstName = async (value) => {
    setFirstNameTmp(value);

    await dbAppSettingsUpdate({
      'user_settings.firstname': { value, updatedAt: new Date().toISOString() },
    });
  };

  const handleChangeMiddleName = async (value: string) => {
    setMiddleNameTmp(value);

    await dbAppSettingsUpdate({
      'user_settings.middlename': {
        value,
        updatedAt: new Date().toISOString(),
      },
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
    middleNameTmp,
    lastNameTmp,
    handleChangeFirstName,
    handleChangeMiddleName,
    handleChangeLastName,
    userEmail,
    isConnected,
  };
};

export default useUserProfileDetails;
