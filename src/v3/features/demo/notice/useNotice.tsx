import { useState } from 'react';

const useNotice = () => {
  const [open, setOpen] = useState(true);

  const handleClose = () => setOpen(false);

  return { open, handleClose };
};

export default useNotice;
