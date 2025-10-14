import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useBreakpoints } from '@hooks/index';
import { setPersonCurrentDetails } from '@services/states/persons';
import { personCurrentDetailsState, personsActiveState } from '@states/persons';
import { computeYearsDiff } from '@utils/date';
import { buildPersonFullname, generateDisplayName } from '@utils/common';
import { appLangState } from '@states/app';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
} from '@states/settings';
import { UsersOption } from '../../congregation/field_service_groups/group_members/index.types';
import useFamilyMembers from '../family_members/useFamilyMembers';

const useBasicInfo = () => {
  const person = useAtomValue(personCurrentDetailsState);
  const appLang = useAtomValue(appLangState);
  const displayNameEnabled = useAtomValue(displayNameMeetingsEnableState);

  const { tabletDown } = useBreakpoints();

  const [isInactive, setIsInactive] = useState(false);
  const [age, setAge] = useState('0');
  const [nameFlex, setNameFlex] = useState<
    'row' | 'row-reverse' | 'column' | 'column-reverse'
  >('row');
  const personsActive = useAtomValue(personsActiveState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const { isFamilyHead, familyHeadName, isCurrentPersonMemberOfAFamily } =
    useFamilyMembers();

  const persons: UsersOption[] = useMemo(() => {
    return personsActive
      .filter((p) => p.person_uid !== person.person_uid)
      .map((p) => {
        return {
          person_uid: p.person_uid,
          person_name: buildPersonFullname(
            p.person_data.person_lastname.value,
            p.person_data.person_firstname.value,
            fullnameOption
          ),
        };
      });
  }, [personsActive, fullnameOption, person]);

  const handleChangeFirstname = async (value: string) => {
    const newPerson = structuredClone(person);

    newPerson.person_data.person_firstname.value = value;
    newPerson.person_data.person_firstname.updatedAt = new Date().toISOString();

    const displayNameCurrent =
      newPerson.person_data.person_display_name.value.trim();

    if (!displayNameCurrent) {
      const dispName = generateDisplayName(
        newPerson.person_data.person_lastname.value,
        value
      );

      newPerson.person_data.person_display_name.value = dispName;
      newPerson.person_data.person_display_name.updatedAt =
        new Date().toISOString();
    }

    setPersonCurrentDetails(newPerson);
  };

  const handleChangeLastname = async (value: string) => {
    const newPerson = structuredClone(person);

    newPerson.person_data.person_lastname.value = value;
    newPerson.person_data.person_lastname.updatedAt = new Date().toISOString();

    const displayNameCurrent =
      newPerson.person_data.person_display_name.value.trim();

    if (!displayNameCurrent) {
      const dispName = generateDisplayName(
        value,
        newPerson.person_data.person_firstname.value
      );

      newPerson.person_data.person_display_name.value = dispName;
      newPerson.person_data.person_display_name.updatedAt =
        new Date().toISOString();
    }

    setPersonCurrentDetails(newPerson);
  };

  const handleChangeDisplayName = async (value: string) => {
    const newPerson = structuredClone(person);

    newPerson.person_data.person_display_name.value = value;
    newPerson.person_data.person_display_name.updatedAt =
      new Date().toISOString();

    setPersonCurrentDetails(newPerson);
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

    setPersonCurrentDetails(newPerson);
  };

  const handleChangeBirthDate = async (value: Date) => {
    const newPerson = structuredClone(person);

    newPerson.person_data.birth_date.value =
      value === null ? null : new Date(value).toISOString();
    newPerson.person_data.birth_date.updatedAt = new Date().toISOString();

    setPersonCurrentDetails(newPerson);
  };

  const handleChangeEmailAddress = async (value: string) => {
    const newPerson = structuredClone(person);

    newPerson.person_data.email.value = value;
    newPerson.person_data.email.updatedAt = new Date().toISOString();

    setPersonCurrentDetails(newPerson);
  };

  const handleChangePhone = async (value: string) => {
    const newPerson = structuredClone(person);

    newPerson.person_data.phone.value = value;
    newPerson.person_data.phone.updatedAt = new Date().toISOString();

    setPersonCurrentDetails(newPerson);
  };

  const handleChangeAddress = async (value: string) => {
    const newPerson = structuredClone(person);

    newPerson.person_data.address.value = value;
    newPerson.person_data.address.updatedAt = new Date().toISOString();

    setPersonCurrentDetails(newPerson);
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
    persons,
    isCurrentPersonMemberOfAFamily,
    familyHeadName,
    isFamilyHead,
  };
};

export default useBasicInfo;
