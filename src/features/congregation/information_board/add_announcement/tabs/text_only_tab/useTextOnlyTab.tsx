import { InfoBoardAnnouncementType } from '@definition/information_board';
import { ChangeEvent, Dispatch, SetStateAction, useCallback } from 'react';

const useTextOnlyTab = (
  changeDraft: Dispatch<SetStateAction<InfoBoardAnnouncementType | null>>
) => {
  const handleChangeTitle = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      changeDraft((prev) => {
        if (!prev) return prev;
        const draft = structuredClone(prev);
        draft.title = e.target.value;
        draft.updatedAt = new Date().toISOString();
        return draft;
      });
    },
    [changeDraft]
  );

  const handleChangeCategory = useCallback(
    (e: ChangeEvent<{ value: unknown }>) => {
      changeDraft((prev) => {
        if (!prev) return prev;
        const draft = structuredClone(prev);
        draft.category = e.target
          .value as InfoBoardAnnouncementType['category'];
        draft.updatedAt = new Date().toISOString();
        return draft;
      });
    },
    [changeDraft]
  );

  const handleChangeText = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      changeDraft((prev) => {
        if (!prev) return prev;
        const draft = structuredClone(prev);
        draft.text = e.target.value;
        draft.updatedAt = new Date().toISOString();
        return draft;
      });
    },
    [changeDraft]
  );

  return {
    handleChangeTitle,
    handleChangeCategory,
    handleChangeText,
  };
};

export default useTextOnlyTab;
