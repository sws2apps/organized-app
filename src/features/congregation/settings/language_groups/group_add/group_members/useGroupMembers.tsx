import { useState } from 'react';
import { GroupMembersProps } from './index.types';

const useGroupMembers = ({ group, onAction }: GroupMembersProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCreateGroup = async () => {
    if (group.group_data.members.length === 0) return;

    if (isProcessing) return;

    setIsProcessing(true);
    await onAction();
    setIsProcessing(false);
  };

  return { handleCreateGroup, isProcessing };
};

export default useGroupMembers;
