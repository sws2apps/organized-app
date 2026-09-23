import Typography from '@components/typography';
import { InformationBoardCategory } from '@definition/information_board';
import { useCallback, useMemo } from 'react';
import IBAnnouncementCard from './announcement_card';
import {
  infoBoardAddAnnouncementState,
  infoBoardAnnouncementsState,
} from '@states/information_board';
import { useAtomValue, useSetAtom } from 'jotai';
import { dbInformationBoardUpdateAnnouncement } from '@services/dexie/information_board';
import useCurrentUser from '@hooks/useCurrentUser';
import { displaySnackNotification } from '@services/states/app';
import useAppTranslation from '@hooks/useAppTranslation';

// This is hook to auto generate and sort announcements
// for information board pages
const useIBPageAnnouncements = (category: InformationBoardCategory) => {
  const { isAdmin } = useCurrentUser();
  const { t } = useAppTranslation();
  const announcements = useAtomValue(infoBoardAnnouncementsState);
  const setAddAnnoucement = useSetAtom(infoBoardAddAnnouncementState);

  const handleOnPin = useCallback(
    async (announcementId: string) => {
      try {
        let isPinned = false;
        let announcementTitle = '';

        await dbInformationBoardUpdateAnnouncement(
          announcementId,
          (announcement) => {
            isPinned = !announcement.pin_at_the_top.value;
            announcementTitle = announcement.title;
            announcement.pin_at_the_top.value = isPinned;
            announcement.pin_at_the_top.updatedAt = new Date().toISOString();
            announcement.updatedAt = new Date().toISOString();
          }
        );

        displaySnackNotification({
          header: isPinned
            ? t('tr_announcementPinned')
            : t('tr_announcementUnpinned'),
          message: isPinned
            ? t('tr_announcementPinnedDesc', {
                announcementTitle: announcementTitle,
              })
            : t('tr_announcementUnpinnedDesc', {
                announcementTitle: announcementTitle,
              }),
          severity: 'success',
        });
      } catch (error) {
        console.error('Error pinning/unpinning announcement:', error);
      }
    },
    [t]
  );

  const handleOnDelete = useCallback(async (announcementId: string) => {
    await dbInformationBoardUpdateAnnouncement(
      announcementId,
      (announcement) => {
        announcement._deleted = true;
        announcement.updatedAt = new Date().toISOString();
      }
    );
  }, []);

  const handleOnEdit = useCallback(
    (announcementId: string) => {
      setAddAnnoucement({ open: true, announcementId });
    },
    [setAddAnnoucement]
  );

  const announcementsForThisPage = useMemo(() => {
    return announcements
      .filter(
        (announcement) =>
          announcement.category === category && announcement._deleted === false
      )
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }, [announcements, category]);

  const pinnedAnnouncements = useMemo(() => {
    const data = announcementsForThisPage.filter(
      (announcement) => announcement.pin_at_the_top.value
    );
    return data.map((announcement) => (
      <IBAnnouncementCard
        key={announcement.id}
        title={announcement.title}
        pinned={true}
        content={
          <Typography
            className="body-regular"
            color="var(--black)"
            sx={{
              minWidth: 0,
              overflowWrap: 'anywhere',
            }}
          >
            {announcement.text}
          </Typography>
        }
        onPin={() => handleOnPin(announcement.id)}
        onEdit={() => handleOnEdit(announcement.id)}
        date={new Date(announcement.updatedAt)}
        onDelete={isAdmin ? () => handleOnDelete(announcement.id) : undefined}
      />
    ));
  }, [
    announcementsForThisPage,
    handleOnDelete,
    handleOnEdit,
    handleOnPin,
    isAdmin,
  ]);

  const unpinnedAnnouncements = useMemo(() => {
    const data = announcementsForThisPage.filter(
      (announcement) => !announcement.pin_at_the_top.value
    );

    return data.map((announcement) => (
      <IBAnnouncementCard
        key={announcement.id}
        title={announcement.title}
        pinned={false}
        content={
          <Typography
            className="body-regular"
            color="var(--black)"
            sx={{
              minWidth: 0,
              overflowWrap: 'anywhere',
            }}
          >
            {announcement.text}
          </Typography>
        }
        onPin={() => handleOnPin(announcement.id)}
        onEdit={() => handleOnEdit(announcement.id)}
        date={new Date(announcement.updatedAt)}
        onDelete={isAdmin ? () => handleOnDelete(announcement.id) : undefined}
      />
    ));
  }, [
    announcementsForThisPage,
    handleOnDelete,
    handleOnEdit,
    handleOnPin,
    isAdmin,
  ]);

  return {
    pinnedAnnouncements,
    unpinnedAnnouncements,
  };
};

export default useIBPageAnnouncements;
