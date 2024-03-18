import { saveS34 } from '@services/dexie/publicTalks';
import { useEffect, useState } from 'react';

const useTalkRow = (talkNumber: number, talkTitle: string, defaultExpand: boolean) => {
  const [collapseOpen, setCollapseOpen] = useState(defaultExpand);
  const [isEditMode, setIsEditMode] = useState(false);
  const [talkTitleTmp, setTalkTitleTmp] = useState(talkTitle);

  const handleToggleCollapse = () => {
    setCollapseOpen((prev) => !prev);
  };

  const handleToggleEdit = () => {
    setIsEditMode((prev) => !prev);
  };

  const handleTalkTitleChange = async (value) => {
    setTalkTitleTmp(value);
  };

  const handleSaveTalkTile = async () => {
    await saveS34(talkNumber, talkTitleTmp);
    setIsEditMode(false);
  };

  useEffect(() => {
    setTalkTitleTmp(talkTitle);
  }, [talkTitle]);

  useEffect(() => {
    setCollapseOpen(defaultExpand);
  }, [defaultExpand]);

  return {
    collapseOpen,
    handleToggleCollapse,
    isEditMode,
    handleToggleEdit,
    talkTitleTmp,
    handleTalkTitleChange,
    handleSaveTalkTile,
  };
};

export default useTalkRow;
