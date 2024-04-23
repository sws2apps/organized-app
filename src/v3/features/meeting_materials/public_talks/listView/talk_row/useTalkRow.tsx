import { useEffect, useState } from 'react';

const useTalkRow = (defaultExpand: boolean) => {
  const [collapseOpen, setCollapseOpen] = useState(defaultExpand);
  const [isHistoryFocused, setIsHistoryFocused] = useState(false);

  const handleToggleCollapse = () => {
    setCollapseOpen((prev) => !prev);
  };

  const handleHistoryFocused = () => {
    setIsHistoryFocused(true);
  };

  const handleHistoryUnfocused = () => {
    setIsHistoryFocused(false);
  };

  useEffect(() => {
    setCollapseOpen(defaultExpand);
  }, [defaultExpand]);

  return {
    collapseOpen,
    handleToggleCollapse,
    isHistoryFocused,
    handleHistoryFocused,
    handleHistoryUnfocused,
  };
};

export default useTalkRow;
