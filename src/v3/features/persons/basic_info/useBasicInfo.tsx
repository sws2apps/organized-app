import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useBreakpoints } from '@hooks/index';
import { setPersonCurrentDetails } from '@services/recoil/persons';
import { personCurrentDetailsState } from '@states/persons';
import { computeYearsDiff } from '@utils/date';
import { generateDisplayName } from '@utils/common';
import { appLangState } from '@states/app';
import { displayNameEnableState } from '@states/settings';

const useBasicInfo = () => {
  const person = useRecoilValue(personCurrentDetailsState);
  const appLang = useRecoilValue(appLangState);
  const displayNameEnabled = useRecoilValue(displayNameEnableState);

  const { tabletDown } = useBreakpoints();

  const [age, setAge] = useState('0');
  const [nameFlex, setNameFlex] = useState<'row' | 'row-reverse' | 'column' | 'column-reverse'>('row');
  const [isInactive, setIsInactive] = useState(false);

  const handleChangeFirstname = async (value: string) => {
    const newPerson = structuredClone(person);

    newPerson.person_firstname.value = value;
    newPerson.person_firstname.updatedAt = new Date().toISOString();

    if (displayNameEnabled) {
      const dispName = generateDisplayName(newPerson.person_lastname.value, value);
      newPerson.person_display_name.value = dispName;
      newPerson.person_display_name.updatedAt = new Date().toISOString();
    }

    await setPersonCurrentDetails(newPerson);
  };

  const handleChangeLastname = async (value: string) => {
    const newPerson = structuredClone(person);
    newPerson.person_lastname.value = value;
    newPerson.person_lastname.updatedAt = new Date().toISOString();

    if (displayNameEnabled) {
      const dispName = generateDisplayName(value, newPerson.person_firstname.value);
      newPerson.person_display_name.value = dispName;
      newPerson.person_display_name.updatedAt = new Date().toISOString();
    }

    await setPersonCurrentDetails(newPerson);
  };

  const handleChangeDisplayName = async (value: string) => {
    const newPerson = structuredClone(person);

    newPerson.person_display_name.value = value;
    newPerson.person_display_name.updatedAt = new Date().toISOString();

    await setPersonCurrentDetails(newPerson);
  };

  const handleToggleGender = async (value) => {
    const newPerson = structuredClone(person);

    if (value === 'male') {
      newPerson.male.value = true;
      newPerson.male.updatedAt = new Date().toISOString();

      newPerson.female.value = false;
      newPerson.female.updatedAt = new Date().toISOString();
    }

    if (value === 'female') {
      newPerson.male.value = false;
      newPerson.male.updatedAt = new Date().toISOString();

      newPerson.female.value = true;
      newPerson.female.updatedAt = new Date().toISOString();
    }

    await setPersonCurrentDetails(newPerson);
  };

  const handleChangeBirthDate = async (value: Date) => {
    const newPerson = structuredClone(person);

    newPerson.birth_date.value = value === null ? null : new Date(value).toISOString();
    newPerson.birth_date.updatedAt = new Date().toISOString();

    await setPersonCurrentDetails(newPerson);
  };

  const handleChangeEmailAddress = async (value: string) => {
    const newPerson = structuredClone(person);

    newPerson.email.value = value;
    newPerson.email.updatedAt = new Date().toISOString();

    await setPersonCurrentDetails(newPerson);
  };

  const handleChangePhone = async (value: string) => {
    const newPerson = structuredClone(person);

    newPerson.phone.value = value;
    newPerson.phone.updatedAt = new Date().toISOString();

    await setPersonCurrentDetails(newPerson);
  };

  const handleChangeAddress = async (value: string) => {
    const newPerson = structuredClone(person);

    newPerson.address.value = value;
    newPerson.address.updatedAt = new Date().toISOString();

    await setPersonCurrentDetails(newPerson);
  };

  useEffect(() => {
    if (person.birth_date.value === null) {
      setAge('0');
    }

    if (person.birth_date.value !== null) {
      const age = computeYearsDiff(person.birth_date.value);
      setAge(age);
    }
  }, [person.birth_date.value]);

  useEffect(() => {
    if (tabletDown) {
      if (appLang === 'mg-MG') {
        setNameFlex('column-reverse');
      } else {
        setNameFlex('column');
      }
    }

    if (!tabletDown) {
      if (appLang === 'mg-MG') {
        setNameFlex('row-reverse');
      } else {
        setNameFlex('row');
      }
    }
  }, [tabletDown, appLang]);

  useEffect(() => {
    if (person.publisher_baptized.active.value) {
      const isActive =
        person.publisher_baptized.history.filter((record) => record._deleted === null && record.end_date.value === null)
          .length === 1;

      setIsInactive(!isActive);
    }

    if (person.publisher_unbaptized.active.value) {
      const isActive =
        person.publisher_unbaptized.history.filter(
          (record) => record._deleted === null && record.end_date.value === null
        ).length === 1;
      setIsInactive(!isActive);
    }
  }, [person.publisher_baptized, person.publisher_unbaptized]);

  return {
    handleChangeBirthDate,
    person,
    age,
    handleToggleGender,
    handleChangeFirstname,
    handleChangeLastname,
    handleChangeDisplayName,
    handleChangeEmailAddress,
    handleChangePhone,
    handleChangeAddress,
    nameFlex,
    isInactive,
    displayNameEnabled,
  };
};

export default useBasicInfo;
