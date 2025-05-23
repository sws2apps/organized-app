import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAtomValue } from 'jotai';
import { IconCheckCircle, IconError } from '@components/icons';
import { personCurrentDetailsState } from '@states/persons';
import { useAppTranslation } from '@hooks/index';
import { displaySnackNotification } from '@services/states/app';
import { dbPersonsSave } from '@services/dexie/persons';
import { personAssignmentsRemove } from '@services/app/persons';
import { getMessageByCode } from '@services/i18n/translation';
import { settingsState, userDataViewState } from '@states/settings';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import { dbFieldServiceGroupSave } from '@services/dexie/field_service_groups';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { PersonType } from '@definition/person';

const useButtonActions = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { t } = useAppTranslation();

  const isNewPerson = id === undefined;

  const person = useAtomValue(personCurrentDetailsState);
  const dataView = useAtomValue(userDataViewState);
  const groups = useAtomValue(fieldWithLanguageGroupsState);
  const settings = useAtomValue(settingsState);

  const isPersonDisqualified = person.person_data.disqualified.value;
  const isPersonArchived = person.person_data.archived.value;

  const [isDisqualify, setIsDisqualify] = useState(false);
  const [isQualify, setIsQualify] = useState(false);

  const handleDisqualify = () => setIsDisqualify(true);

  const handleDisqualifyCancel = () => setIsDisqualify(false);

  const handleQualify = () => setIsQualify(true);

  const handleQualifyCancel = () => setIsQualify(false);

  const handleRemoveOldGroup = async (person: PersonType) => {
    const oldGroup = groups.find((record) =>
      record.group.group_data.members.some(
        (m) => m.person_uid === person.person_uid
      )
    );

    if (!oldGroup) return;

    // field service group
    if (oldGroup.editable) {
      const oldGroupSave = structuredClone(oldGroup.group);

      const findIndex = oldGroupSave.group_data.members.find(
        (record) => record.person_uid === person.person_uid
      ).sort_index;

      oldGroupSave.group_data.members = oldGroupSave.group_data.members.filter(
        (record) => record.person_uid !== person.person_uid
      );

      for (const member of oldGroupSave.group_data.members) {
        if (member.sort_index < findIndex) continue;

        member.sort_index = member.sort_index - 1;
      }

      oldGroupSave.group_data.updatedAt = new Date().toISOString();

      await dbFieldServiceGroupSave(oldGroupSave);
    }

    // language group
    if (!oldGroup.editable) {
      const languageGroups = structuredClone(
        settings.cong_settings.language_groups.groups
      );

      const group = languageGroups.find(
        (record) => record.id === oldGroup.group.group_id
      );

      if (!group) return;

      if (group.overseers.includes(person.person_uid)) {
        group.overseers = group.overseers.filter(
          (record) => record !== person.person_uid
        );

        group.updatedAt = new Date().toISOString();

        await dbAppSettingsUpdate({
          'cong_settings.language_groups.groups': languageGroups,
        });
      }

      const newPerson = structuredClone(person);

      newPerson.person_data.categories = {
        value: newPerson.person_data.categories.value.filter(
          (record) => record !== group.id
        ),
        updatedAt: new Date().toISOString(),
      };

      await dbPersonsSave(newPerson);

      return newPerson;
    }
  };

  const handleSaveGroup = async (person: PersonType) => {
    const groupSelector = document
      .querySelector('.service-group-selector')
      ?.querySelector('input');

    if (!groupSelector) return;

    const personGroup = groupSelector.value;

    if (!personGroup || personGroup?.length === 0) return;

    const findOldGroup = groups.find((record) =>
      record.group.group_data.members.some(
        (p) => p.person_uid === person.person_uid
      )
    );

    if (findOldGroup?.group.group_id === personGroup) return;

    const groupData = groups.find(
      (record) => record.group.group_id === personGroup
    );

    if (!groupData) return;

    const newPerson = await handleRemoveOldGroup(person);

    if (groupData.editable) {
      const lastIndex = groupData.group.group_data.members.reduce(
        (personIndex: number, current) => {
          if (current.sort_index > personIndex) {
            return current.sort_index;
          }

          return personIndex;
        },
        0
      );

      let newIndex = lastIndex + 1;
      newIndex = newIndex < 2 ? 2 : newIndex;

      const newGroup = structuredClone(groupData.group);

      newGroup.group_data.members.push({
        isAssistant: false,
        isOverseer: false,
        person_uid: person.person_uid,
        sort_index: newIndex,
      });

      newGroup.group_data.updatedAt = new Date().toISOString();

      await dbFieldServiceGroupSave(newGroup);
    }

    if (!groupData.editable) {
      const dataPerson = newPerson
        ? structuredClone(newPerson)
        : structuredClone(person);

      dataPerson.person_data.categories.value.push(groupData.group.group_id);
      dataPerson.person_data.categories.updatedAt = new Date().toISOString();

      await dbPersonsSave(dataPerson);
    }
  };

  const handleSavePerson = async () => {
    try {
      if (Array.isArray(person.person_data.categories)) {
        person.person_data.categories = {
          value: ['main'],
          updatedAt: new Date().toISOString(),
        };
      }

      if (dataView !== 'main') {
        const categories = Array.from(
          new Set([...person.person_data.categories.value, dataView])
        );

        person.person_data.categories = {
          value: categories,
          updatedAt: new Date().toISOString(),
        };
      }

      await dbPersonsSave(person, isNewPerson);

      await handleSaveGroup(person);

      if (isNewPerson) {
        displaySnackNotification({
          header: t('tr_personAdded'),
          message: t('tr_personAddedDesc'),
          severity: 'success',
          icon: <IconCheckCircle color="var(--white)" />,
        });

        navigate(-1);
        navigate('/persons');
      }

      if (!isNewPerson) {
        displaySnackNotification({
          header: t('tr_personSaved'),
          message: t('tr_personSavedDesc'),
          severity: 'success',
          icon: <IconCheckCircle color="var(--white)" />,
        });
      }
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: error.message,
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
    }
  };

  const handleDisqualifyConfirm = async () => {
    try {
      const newPerson = structuredClone(person);

      newPerson.person_data.disqualified = {
        value: true,
        updatedAt: new Date().toISOString(),
      };

      personAssignmentsRemove(newPerson);

      await dbPersonsSave(newPerson);

      setIsDisqualify(false);
    } catch (error) {
      setIsDisqualify(false);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: error.message,
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
    }
  };

  const handleQualifyConfirm = async () => {
    try {
      const newPerson = structuredClone(person);
      newPerson.person_data.disqualified = {
        value: false,
        updatedAt: new Date().toISOString(),
      };
      await dbPersonsSave(newPerson);
      setIsQualify(false);
    } catch (error) {
      setIsQualify(false);
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: error.message,
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
    }
  };

  return {
    handleSavePerson,
    handleDisqualifyConfirm,
    isNewPerson,
    isDisqualify,
    handleDisqualify,
    handleDisqualifyCancel,
    isPersonDisqualified,
    handleQualifyConfirm,
    handleQualify,
    handleQualifyCancel,
    isQualify,
    isPersonArchived,
  };
};

export default useButtonActions;
