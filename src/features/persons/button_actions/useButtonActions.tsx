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
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import { dbFieldServiceGroupSave } from '@services/dexie/field_service_groups';

const useButtonActions = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { t } = useAppTranslation();

  const isNewPerson = id === undefined;

  const person = useAtomValue(personCurrentDetailsState);
  const groups = useAtomValue(fieldWithLanguageGroupsState);

  const isPersonDisqualified = person.person_data.disqualified.value;
  const isPersonArchived = person.person_data.archived.value;

  const [isDisqualify, setIsDisqualify] = useState(false);
  const [isQualify, setIsQualify] = useState(false);

  const handleDisqualify = () => setIsDisqualify(true);

  const handleDisqualifyCancel = () => setIsDisqualify(false);

  const handleQualify = () => setIsQualify(true);

  const handleQualifyCancel = () => setIsQualify(false);

  const handleRemoveOldGroup = async () => {
    const oldGroup = groups.find((record) =>
      record.group_data.members.some((m) => m.person_uid === person.person_uid)
    );

    if (!oldGroup) return;

    const oldGroupSave = structuredClone(oldGroup);

    oldGroupSave.group_data.members = oldGroupSave.group_data.members
      .filter((member) => member.person_uid !== person.person_uid)
      .sort((a, b) => a.sort_index - b.sort_index);

    oldGroupSave.group_data.members.forEach((member, index) => {
      member.sort_index = index;
    });

    oldGroupSave.group_data.updatedAt = new Date().toISOString();

    await dbFieldServiceGroupSave(oldGroupSave);
  };

  const handleSaveGroup = async () => {
    const groupSelector = document
      .querySelector('.service-group-selector')
      ?.querySelector('input');

    if (!groupSelector) return;

    const personGroup = groupSelector.value;

    if (!personGroup || personGroup?.length === 0) return;

    const group = groups.find((record) => record.group_id === personGroup);

    if (!group) return;

    const findInGroup = group.group_data.members.some(
      (record) => record.person_uid === person.person_uid
    );

    if (findInGroup) return;

    await handleRemoveOldGroup();

    const groupSave = structuredClone(group);

    groupSave.group_data.members.sort((a, b) => a.sort_index - b.sort_index);

    groupSave.group_data.members.push({
      isAssistant: false,
      isOverseer: false,
      person_uid: person.person_uid,
      sort_index: 100,
    });

    groupSave.group_data.members.forEach((member, index) => {
      member.sort_index = index;
    });

    groupSave.group_data.updatedAt = new Date().toISOString();

    await dbFieldServiceGroupSave(groupSave);
  };

  const handleSavePerson = async () => {
    try {
      await dbPersonsSave(person, isNewPerson);

      await handleSaveGroup();

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
