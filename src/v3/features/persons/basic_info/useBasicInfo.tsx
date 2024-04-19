import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { setPersonCurrentDetails } from '@services/recoil/persons';
import { personCurrentDetailsState } from '@states/persons';
import { computeYearsDiff } from '@utils/date';
import { generateDisplayName } from '@utils/common';
import { appLangState } from '@states/app';
import { useBreakpoints } from '@hooks/index';

const useBasicInfo = () => {
  const person = useRecoilValue(personCurrentDetailsState);
  const appLang = useRecoilValue(appLangState);

  const { tabletDown } = useBreakpoints();

  const [age, setAge] = useState('0');
  const [nameFlex, setNameFlex] = useState<'row' | 'row-reverse' | 'column' | 'column-reverse'>('row');
  const [isInactive, setIsInactive] = useState(false);

  const handleChangeFirstname = async (value: string) => {
    const newPerson = structuredClone(person);

    newPerson.person_firstname.value = value;
    newPerson.person_firstname.updatedAt = new Date().toISOString();

    const dispName = generateDisplayName(newPerson.person_lastname.value, value);
    newPerson.person_displayName.value = dispName;
    newPerson.person_displayName.updatedAt = new Date().toISOString();

    await setPersonCurrentDetails(newPerson);
  };

  const handleChangeLastname = async (value: string) => {
    const newPerson = structuredClone(person);
    newPerson.person_lastname.value = value;
    newPerson.person_lastname.updatedAt = new Date().toISOString();

    const dispName = generateDisplayName(value, newPerson.person_firstname.value);
    newPerson.person_displayName.value = dispName;
    newPerson.person_displayName.updatedAt = new Date().toISOString();

    await setPersonCurrentDetails(newPerson);
  };

  const handleChangeDisplayName = async (value: string) => {
    const newPerson = structuredClone(person);

    newPerson.person_displayName.value = value;
    newPerson.person_displayName.updatedAt = new Date().toISOString();

    await setPersonCurrentDetails(newPerson);
  };

  const handleToggleGender = async (value) => {
    const newPerson = structuredClone(person);

    if (value === 'male') {
      newPerson.isMale.value = true;
      newPerson.isMale.updatedAt = new Date().toISOString();

      newPerson.isFemale.value = false;
      newPerson.isFemale.updatedAt = new Date().toISOString();
    }

    if (value === 'female') {
      newPerson.isMale.value = false;
      newPerson.isMale.updatedAt = new Date().toISOString();

      newPerson.isFemale.value = true;
      newPerson.isFemale.updatedAt = new Date().toISOString();
    }

    await setPersonCurrentDetails(newPerson);
  };

  const handleChangeBirthDate = async (value: Date) => {
    const newPerson = structuredClone(person);

    newPerson.birthDate.value = value === null ? null : new Date(value).toISOString();
    newPerson.birthDate.updatedAt = new Date().toISOString();

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
    if (person.birthDate.value === null) {
      setAge('0');
    }

    if (person.birthDate.value !== null) {
      const age = computeYearsDiff(person.birthDate.value);
      setAge(age);
    }
  }, [person.birthDate.value]);

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
    if (person.baptizedPublisher.active.value) {
      const isActive =
        person.baptizedPublisher.history.filter((record) => record._deleted === null && record.endDate.value === null)
          .length === 1;

      setIsInactive(!isActive);
    }

    if (person.unbaptizedPublisher.active.value) {
      const isActive =
        person.unbaptizedPublisher.history.filter((record) => record._deleted === null && record.endDate.value === null)
          .length === 1;
      setIsInactive(!isActive);
    }
  }, [person.baptizedPublisher, person.unbaptizedPublisher]);

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
  };
};

export default useBasicInfo;
