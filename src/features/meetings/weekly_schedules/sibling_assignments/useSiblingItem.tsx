import { useState } from 'react';

const useSiblingItem = () => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  return { expanded, handleToggle };
};

export default useSiblingItem;
