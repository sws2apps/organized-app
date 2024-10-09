import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { userLocalUIDState } from '@states/settings';
import { GroupHeaderProps } from './index.types';

const useHeader = ({ group, index }: GroupHeaderProps) => {
  const { t } = useAppTranslation();

  const { isServiceCommittee } = useCurrentUser();

  const userUID = useRecoilValue(userLocalUIDState);

  const [dlgOpen, setDlgOpen] = useState(false);
  const [type, setType] = useState<'edit' | 'delete'>('edit');

  const bg_color = useMemo(() => {
    const css = `--group-${index}-base`;

    return `rgba(var(${css}), 0.12)`;
  }, [index]);

  const color = useMemo(() => {
    const css = `--group-${index}`;
    return `var(${css})`;
  }, [index]);

  const group_index = useMemo(() => {
    return t('tr_groupNumber', { groupNumber: index });
  }, [t, index]);

  const group_name = useMemo(() => {
    const name = group.group_data.name;

    if (name.length === 0) return;

    return name;
  }, [group]);

  const my_group = useMemo(() => {
    const isMyGroup = group.group_data.members.some(
      (record) => record.person_uid === userUID
    );

    return isMyGroup;
  }, [group, userUID]);

  const handleOpenEdit = () => {
    setType('edit');
    setDlgOpen(true);
  };

  const handleCloseDialog = () => setDlgOpen(false);

  const handleOpenDelete = () => {
    setType('delete');
  };

  return {
    bg_color,
    color,
    group_index,
    group_name,
    my_group,
    handleOpenEdit,
    dlgOpen,
    handleCloseDialog,
    handleOpenDelete,
    type,
    isServiceCommittee,
  };
};

export default useHeader;
