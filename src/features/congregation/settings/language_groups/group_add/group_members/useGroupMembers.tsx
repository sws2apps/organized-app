import { useState } from 'react';
import { GroupMembersProps } from './index.types';

const useGroupMembers = ({
  group,
  onChange,
  onChangeMembers,
  onAction,
  members,
}: GroupMembersProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAdminChange = (values: string[]) => {
    const newGroup = structuredClone(group);
    newGroup.admins = values;
    onChange(newGroup);
  };

  const handleAdminDelete = (value: string) => {
    const newGroup = structuredClone(group);
    newGroup.admins = newGroup.admins.filter((record) => record !== value);

    onChange(newGroup);
  };

  const handleMembersChange = (values: string[]) => {
    onChangeMembers(values);
  };

  const handleMembersDelete = (value: string) => {
    onChangeMembers(members.filter((record) => record !== value));
  };

  const handleCreateGroup = async () => {
    if (group.admins.length === 0) return;

    if (isProcessing) return;

    setIsProcessing(true);
    await onAction();
    setIsProcessing(false);
  };

  return {
    handleAdminChange,
    handleAdminDelete,
    handleMembersChange,
    handleMembersDelete,
    handleCreateGroup,
    isProcessing,
  };
};

export default useGroupMembers;
