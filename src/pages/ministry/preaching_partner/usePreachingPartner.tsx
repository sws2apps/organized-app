import { useState } from 'react';
import { useAtom } from 'jotai';
import { preachingPartnerTabState } from '@states/preaching_partner';

const usePreachingPartner = () => {
  const [tab, setTab] = useAtom(preachingPartnerTabState);

  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleOpenEditor = () => setIsEditorOpen(true);

  const handleCloseEditor = () => setIsEditorOpen(false);

  return { tab, setTab, isEditorOpen, handleOpenEditor, handleCloseEditor };
};

export default usePreachingPartner;
