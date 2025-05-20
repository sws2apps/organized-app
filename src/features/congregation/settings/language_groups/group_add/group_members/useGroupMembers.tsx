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

  const handleOverseersChange = (values: string[]) => {
    const newGroup = structuredClone(group);
    newGroup.overseers = values;
    onChange(newGroup);
  };

  const handleOverseerDelete = (value: string) => {
    const newGroup = structuredClone(group);

    newGroup.overseers = newGroup.overseers.filter(
      (record) => record !== value
    );

    onChange(newGroup);
  };

  const handleMembersChange = (values: string[]) => {
    onChangeMembers(values);
  };

  const handleMembersDelete = (value: string) => {
    onChangeMembers(members.filter((record) => record !== value));
  };

  const handleCreateGroup = async () => {
    if (group.overseers.length === 0 && members.length === 0) return;

    if (isProcessing) return;

    setIsProcessing(true);
    await onAction();
    setIsProcessing(false);
  };

  return {
    handleOverseersChange,
    handleOverseerDelete,
    handleMembersChange,
    handleMembersDelete,
    handleCreateGroup,
    isProcessing,
  };
};

export default useGroupMembers;
