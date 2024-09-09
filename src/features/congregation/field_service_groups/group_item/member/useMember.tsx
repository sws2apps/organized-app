import { MouseEvent, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { IconAssistant, IconOverseer, IconPerson } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { buildPersonFullname } from '@utils/common';
import { personsState } from '@states/persons';
import { fullnameOptionState } from '@states/settings';
import { GroupMemberProps } from './index.types';
import usePerson from '@features/persons/hooks/usePerson';

const useMember = ({ member, index }: GroupMemberProps) => {
  const { t } = useAppTranslation();

  const { personIsElder, personIsMS, personIsBaptizedPublisher } = usePerson();

  const persons = useRecoilValue(personsState);
  const fullnameOption = useRecoilValue(fullnameOptionState);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
      return t('tr_groupOverseer');
    }

    if (member.isAssistant) {
      return t('tr_groupOverseerAssistant');
    }
  }, [member, t]);

  const make_overseer = useMemo(() => {
    if (member.isOverseer) return false;

    if (!person) return false;

    const isElder = personIsElder(person);
    const isMS = personIsMS(person);

    return isElder || isMS;
  }, [person, personIsMS, personIsElder, member]);

  const make_assistant = useMemo(() => {
    if (member.isAssistant) return false;

    if (!person) return false;

    if (person.person_data.female.value) return false;

    const isBaptized = personIsBaptizedPublisher(person);
    return isBaptized;
  }, [person, personIsBaptizedPublisher, member]);

  const handleOpenMenu = (e: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => setAnchorEl(null);

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
  };
};

export default useMember;
