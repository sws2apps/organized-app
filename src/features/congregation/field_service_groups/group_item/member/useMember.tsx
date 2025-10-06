import { MouseEvent, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { IconAssistant, IconOverseer, IconPerson } from '@components/icons';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { buildPersonFullname } from '@utils/common';
import { personsState } from '@states/persons';
import { fullnameOptionState } from '@states/settings';
import { fieldGroupsState } from '@states/field_service_groups';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { GroupMemberProps } from './index.types';
import { dbFieldServiceGroupSave } from '@services/dexie/field_service_groups';
import usePerson from '@features/persons/hooks/usePerson';

const useMember = ({ member, index, group_id }: GroupMemberProps) => {
  const { t } = useAppTranslation();

  const { isServiceCommittee } = useCurrentUser();

  const { personIsElder, personIsMS, personIsBaptizedPublisher } = usePerson();

  const persons = useAtomValue(personsState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const groups = useAtomValue(fieldGroupsState);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [removeOpen, setRemoveOpen] = useState(false);

  const open = Boolean(anchorEl);

  const item_hover_color = useMemo(() => {
    const css = `--group-${index}-base`;

    return `rgba(var(${css}), 0.06)`;
  }, [index]);

  const icon_hover_color = useMemo(() => {
    const css = `--group-${index}-base`;

    return `rgba(var(${css}), 0.12)`;
  }, [index]);

  const member_icon = useMemo(() => {
    if (member.isOverseer) {
      return <IconOverseer color="var(--black)" />;
    }

    if (member.isAssistant) {
      return <IconAssistant color="var(--black)" />;
    }

    return <IconPerson color="var(--black)" />;
  }, [member]);

  const person = useMemo(() => {
    return persons.find((record) => record.person_uid === member.person_uid);
  }, [persons, member]);

  const label_overseer = useMemo(() => {
    if (!person) return 'tr_makeOverseer';

    const isElder = personIsElder(person);

    return isElder ? 'tr_makeOverseer' : 'tr_groupServantAssign';
  }, [person, personIsElder]);

  const member_name = useMemo(() => {
    if (!person) return '';

    return buildPersonFullname(
      person.person_data.person_lastname.value,
      person.person_data.person_firstname.value,
      fullnameOption
    );
  }, [person, fullnameOption]);

  const member_desc = useMemo(() => {
    if (member.isOverseer) {
      const isElder = personIsElder(person);

      return isElder ? t('tr_groupOverseer') : t('tr_groupServant');
    }

    if (member.isAssistant) {
      return t('tr_groupOverseerAssistant');
    }
  }, [member, person, personIsElder, t]);

  const make_overseer = useMemo(() => {
    if (!isServiceCommittee) return false;

    if (member.isOverseer) return false;

    if (!person) return false;

    const isElder = personIsElder(person);
    const isMS = personIsMS(person);

    return isElder || isMS;
  }, [isServiceCommittee, person, personIsMS, personIsElder, member]);

  const make_assistant = useMemo(() => {
    if (!isServiceCommittee) return false;

    if (member.isAssistant) return false;

    if (!person) return false;

    if (person.person_data.female.value) return false;

    const isBaptized = personIsBaptizedPublisher(person);
    return isBaptized;
  }, [isServiceCommittee, person, personIsBaptizedPublisher, member]);

  const current_group = useMemo(() => {
    return groups.find((record) => record.group_id === group_id);
  }, [groups, group_id]);

  const handleOpenMenu = (e: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => setAnchorEl(null);

  const handleMakeOverseer = async () => {
    handleCloseMenu();

    try {
      const group = structuredClone(current_group);

      const current = group.group_data.members.find(
        (record) => record.person_uid === member.person_uid
      );

      const overseer = group.group_data.members.find(
        (record) => record.isOverseer
      );

      if (overseer) {
        overseer.isOverseer = false;
        overseer.sort_index = current.sort_index;

        if (current.isAssistant) {
          overseer.isAssistant = true;
        }
      }

      if (!overseer) {
        const currentIndex = current.sort_index;
        let index = currentIndex < 2 ? 2 : currentIndex;

        for (const member of group.group_data.members) {
          if (member.sort_index < currentIndex) continue;

          member.sort_index = index;
          index++;
        }
      }

      current.isOverseer = true;
      current.isAssistant = false;
      current.sort_index = 0;

      group.group_data.updatedAt = new Date().toISOString();

      await dbFieldServiceGroupSave(group);
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleMakeAssistant = async () => {
    handleCloseMenu();

    try {
      const group = structuredClone(current_group);

      const current = group.group_data.members.find(
        (record) => record.person_uid === member.person_uid
      );

      const assistant = group.group_data.members.find(
        (record) => record.isAssistant
      );

      if (assistant) {
        assistant.isAssistant = false;
        assistant.sort_index = current.sort_index;

        if (current.isOverseer) {
          assistant.isOverseer = true;
        }
      }

      if (!assistant) {
        const currentIndex = current.sort_index;
        let index = currentIndex < 2 ? 2 : currentIndex;

        for (const member of group.group_data.members) {
          if (member.sort_index < currentIndex) continue;

          member.sort_index = index;
          index++;
        }
      }

      current.isOverseer = false;
      current.isAssistant = true;
      current.sort_index = 1;

      group.group_data.updatedAt = new Date().toISOString();

      await dbFieldServiceGroupSave(group);
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleOpenRemove = () => {
    handleCloseMenu();
    setRemoveOpen(true);
  };

  const handleCloseRemove = () => setRemoveOpen(false);

  const handlePersonRemove = async () => {
    try {
      const group = structuredClone(current_group);

      group.group_data.members = group.group_data.members.filter(
        (record) => record.person_uid !== member.person_uid
      );

      if (!member.isAssistant && !member.isOverseer) {
        const currentIndex = member.sort_index;
        let index = currentIndex;

        for (const member of group.group_data.members) {
          if (member.sort_index < currentIndex) continue;

          member.sort_index = index;
          index++;
        }
      }

      group.group_data.updatedAt = new Date().toISOString();

      await dbFieldServiceGroupSave(group);

      setRemoveOpen(false);
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return {
    member_icon,
    member_name,
    member_desc,
    icon_hover_color,
    anchorEl,
    open,
    handleOpenMenu,
    handleCloseMenu,
    item_hover_color,
    make_overseer,
    make_assistant,
    handleMakeOverseer,
    handleMakeAssistant,
    handleOpenRemove,
    handleCloseRemove,
    handlePersonRemove,
    removeOpen,
    isServiceCommittee,
    label_overseer,
  };
};

export default useMember;
