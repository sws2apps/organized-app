import { useState } from 'react';

const useHeader = () => {
  const [showDelete, setShowDelete] = useState(false);

  const handleShowDelete = () => setShowDelete(true);

  const handleHideDelete = () => setShowDelete(false);

  return { showDelete, handleShowDelete, handleHideDelete };
};

export default useHeader;
