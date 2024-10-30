import { useState } from 'react';
import { ActionButtonsProps } from './index.types';

const useActionButtons = ({ onApproved, onRejected }: ActionButtonsProps) => {
  const [isRejectProcessing, setIsRejectProcessing] = useState(false);
  const [isApproveProcessing, setIsApproveProcessing] = useState(false);

  const isProcessing = isRejectProcessing || isApproveProcessing;

  const handleApprove = async () => {
    if (isProcessing) return;

    const func = onApproved as unknown as () => Promise<void>;

    setIsApproveProcessing(true);

    await func();

    setIsApproveProcessing(false);
  };

  const handleReject = async () => {
    if (isProcessing) return;

    const func = onRejected as unknown as () => Promise<void>;

    setIsRejectProcessing(true);

    await func();

    setIsRejectProcessing(false);
  };

  return {
    isProcessing,
    handleApprove,
    isRejectProcessing,
    isApproveProcessing,
    handleReject,
  };
};

export default useActionButtons;
