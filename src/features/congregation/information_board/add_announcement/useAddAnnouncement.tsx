import useAppTranslation from '@hooks/useAppTranslation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import TextOnlyTab from './tabs/text_only_tab';
import { InfoBoardAnnouncementType } from '@definition/information_board';
import { useAtomValue } from 'jotai';
import { userDataViewState } from '@states/settings';
import {
  infoBoardAnnouncements,
  informationBoardState,
} from '@states/information_board';
import { dbInformationBoardSave } from '@services/dexie/information_board';
import { createAnnouncementNotification } from '@services/app/announcement_notifications';

const useAddAnnouncement = (
  announcementId: string | undefined,
  onClose: VoidFunction
) => {
  const { t } = useAppTranslation();
  const dataView = useAtomValue(userDataViewState);
  const informationBoard = useAtomValue(informationBoardState);
  const announements = useAtomValue(infoBoardAnnouncements);
  const announcement = useMemo(() => {
    if (!announcementId) return null;
    return (
      announements.find((announcement) => announcement.id === announcementId) ||
      null
    );
  }, [announcementId, announements]);

  const [draft, setDraft] = useState<InfoBoardAnnouncementType | null>(() => {
    if (announcement) {
      return { ...announcement };
    }
    return {
      id: crypto.randomUUID(),
      type: dataView,
      title: '',
      category: undefined,
      text: '',
      short_description: '',
      _deleted: false,
      updatedAt: new Date().toISOString(),
      notification_id: crypto.randomUUID(),
      pin_at_the_top: {
        updatedAt: new Date().toISOString(),
        value: false,
      },
      notify_everybody: true,
    };
  });

  const tabs = useMemo(() => {
    return [
      {
        label: t('tr_textOnly'),
        Component: <TextOnlyTab draft={draft} changeDraft={setDraft} />,
      },
      //   {
      //     label: t('tr_attachment'),
      //     Component: <div></div>,
      //   },
    ];
  }, [draft, t]);

  const handleSwitchPinAtTheTop = useCallback(() => {
    setDraft((prev) => {
      if (!prev) return prev;
      const draft = structuredClone(prev);
      draft.pin_at_the_top.value = !draft.pin_at_the_top.value;
      draft.pin_at_the_top.updatedAt = new Date().toISOString();
      return draft;
    });
  }, []);

  const handleSwitchNotifyEverybody = useCallback(() => {
    setDraft((prev) => {
      if (!prev) return prev;
      const draft = structuredClone(prev);
      draft.notify_everybody = !draft.notify_everybody;

      if (draft.notify_everybody) {
        draft.notification_id = crypto.randomUUID();
      }

      draft.updatedAt = new Date().toISOString();
      return draft;
    });
  }, []);

  const [isPublishEnabled, setIsPublishEnabled] = useState(false);

  useEffect(() => {
    if (draft) {
      setIsPublishEnabled(!!draft.title && !!draft.text && !!draft.category);
    } else {
      setIsPublishEnabled(false);
    }
  }, [draft]);

  const handleCancel = useCallback(() => {
    setDraft(null);
    onClose();
  }, [onClose]);

  const handlePublish = async () => {
    if (!draft) return;

    const updatedInformationBoard = structuredClone(informationBoard);

    const index = updatedInformationBoard.information.announcements.findIndex(
      (item) => item.id === draft.id
    );

    if (index !== -1) {
      updatedInformationBoard.information.announcements[index] = draft;
    } else {
      updatedInformationBoard.information.announcements.push(draft);
    }

    await dbInformationBoardSave(updatedInformationBoard);

    if (draft.notify_everybody) {
      await createAnnouncementNotification(draft);
    }

    onClose();
  };

  return {
    tabs,
    draft,
    handleSwitchPinAtTheTop,
    handleSwitchNotifyEverybody,
    handleCancel,
    handlePublish,
    isPublishEnabled,
  };
};

export default useAddAnnouncement;
