import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useBreakpoints } from '@hooks/index';
import { setPersonCurrentDetails } from '@services/recoil/persons';
import { personCurrentDetailsState } from '@states/persons';
import { computeYearsDiff } from '@utils/date';
import { generateDisplayName } from '@utils/common';
import { appLangState } from '@states/app';
import { displayNameMeetingsEnableState } from '@states/settings';

const useBasicInfo = () => {
  const person = useRecoilValue(personCurrentDetailsState);
  const appLang = useRecoilValue(appLangState);
  const displayNameEnabled = useRecoilValue(displayNameMeetingsEnableState);

  const { tabletDown } = useBreakpoints();

  const [isInactive, setIsInactive] = useState(false);
  const [age, setAge] = useState('0');
  const [nameFlex, setNameFlex] = useState<
    'row' | 'row-reverse' | 'column' | 'column-reverse'
  >('row');

  const handleChangeFirstname = async (value: string) => {
    const newPerson = structuredClone(person);

    newPerson.person_data.person_firstname.value = value;
    newPerson.person_data.person_firstname.updatedAt = new Date().toISOString();

    const dispName = generateDisplayName(
      newPerson.person_data.person_lastname.value,
      value
    );
    newPerson.person_data.person_display_name.value = dispName;
    newPerson.person_data.person_display_name.updatedAt =
      new Date().toISOString();
    await setPersonCurrentDetails(newPerson);
  };

  const handleChangeLastname = async (value: string) => {
    const newPerson = structuredClone(person);
    newPerson.person_data.person_lastname.value = value;
    newPerson.person_data.person_lastname.updatedAt = new Date().toISOString();

    const dispName = generateDisplayName(
      value,
      newPerson.person_data.person_firstname.value
    );
    newPerson.person_data.person_display_name.value = dispName;
    newPerson.person_data.person_display_name.updatedAt =
      new Date().toISOString();

    await setPersonCurrentDetails(newPerson);
  };

  const handleChangeDisplayName = async (value: string) => {
    const newPerson = structuredClone(person);

    newPerson.person_data.person_display_name.value = value;
    newPerson.person_data.person_display_name.updatedAt =
      new Date().toISOString();

    await setPersonCurrentDetails(newPerson);
  };

  const handleToggleGender = async (value) => {
    const newPerson = structuredClone(person);

    if (value === 'male') {
      newPerson.person_data.male.value = true;
      newPerson.person_data.male.updatedAt = new Date().toISOString();

      newPerson.person_data.female.value = false;
      newPerson.person_data.female.updatedAt = new Date().toISOString();
    }

    if (value === 'female') {
      newPerson.person_data.male.value = false;
      newPerson.person_data.male.updatedAt = new Date().toISOString();

      newPerson.person_data.female.value = true;
      newPerson.person_data.female.updatedAt = new Date().toISOString();
    }

    await setPersonCurrentDetails(newPerson);
  };

  const handleChangeBirthDate = async (value: Date) => {
    const newPerson = structuredClone(person);

    newPerson.person_data.birth_date.value =
      value === null ? null : new Date(value).toISOString();
    newPerson.person_data.birth_date.updatedAt = new Date().toISOString();

    await setPersonCurrentDetails(newPerson);
  };

  const handleChangeEmailAddress = async (value: string) => {
    const newPerson = structuredClone(person);

    newPerson.person_data.email.value = value;
    newPerson.person_data.email.updatedAt = new Date().toISOString();

    await setPersonCurrentDetails(newPerson);
  };

  const handleChangePhone = async (value: string) => {
    const newPerson = structuredClone(person);

    newPerson.person_data.phone.value = value;
    newPerson.person_data.phone.updatedAt = new Date().toISOString();

    await setPersonCurrentDetails(newPerson);
  };

  const handleChangeAddress = async (value: string) => {
    const newPerson = structuredClone(person);

    newPerson.person_data.address.value = value;
    newPerson.person_data.address.updatedAt = new Date().toISOString();

    await setPersonCurrentDetails(newPerson);
  };

  const ageToYearsAndMonths = (
    age: string
  ): { years: number; months: number } => {
    if (age === '0') return { years: 0, months: 0 };

    const [yearsPart, fractionalPart = '0'] = age.split('.');
    const years = parseInt(yearsPart, 10);
    const months = Math.floor(parseFloat(`0.${fractionalPart}`) * 12);

    return { years, months };
  };

  useEffect(() => {
    if (person.person_data.birth_date.value === null) {
      setAge('0');
    }

    if (person.person_data.birth_date.value !== null) {
      const age = computeYearsDiff(person.person_data.birth_date.value);
      setAge(age);
    }
  }, [person.person_data.birth_date.value]);

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
    if (person.person_data.publisher_baptized.active.value) {
      const isActive =
        person.person_data.publisher_baptized.history.filter(
          (record) => record._deleted === false && record.end_date === null
        ).length === 1;

      setIsInactive(!isActive);
    }

    if (person.person_data.publisher_unbaptized.active.value) {
      const isActive =
        person.person_data.publisher_unbaptized.history.filter(
          (record) => record._deleted === false && record.end_date === null
        ).length === 1;
      setIsInactive(!isActive);
    }
  }, [
    person.person_data.publisher_baptized,
    person.person_data.publisher_unbaptized,
  ]);

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
    ageToYearsAndMonths,
    nameFlex,
    isInactive,
    displayNameEnabled,
  };
};

export default useBasicInfo;
