import { dutiesCustomState } from '@states/settings';
import { useAtomValue } from 'jotai';
import { useState } from 'react';

const useCustomDuties = () => {
  const customDuties = useAtomValue(dutiesCustomState);

  const [formOpen, setFormOpen] = useState(false);

  const handleOpenForm = () => setFormOpen(true);

  const handleCloseForm = () => setFormOpen(false);

  return { formOpen, handleOpenForm, handleCloseForm, customDuties };
};

export default useCustomDuties;
