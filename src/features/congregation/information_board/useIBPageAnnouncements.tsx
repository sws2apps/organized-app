import Typography from '@components/typography';
import { InformationBoardCategory } from '@definition/information_board';
import { useCallback, useMemo } from 'react';
import IBAnnouncementCard from './announcement_card';
import {
  infoBoardAnnouncements,
  informationBoardState,
} from '@states/information_board';
import { useAtomValue } from 'jotai';
import { dbInformationBoardSave } from '@services/dexie/information_board';
import useCurrentUser from '@hooks/useCurrentUser';

// This is hook to auto generate and sort announcements
// for information board pages
const useIBPageAnnouncements = (category: InformationBoardCategory) => {
  const { isAdmin } = useCurrentUser();
  const informationBoard = useAtomValue(informationBoardState);
  const announcements = useAtomValue(infoBoardAnnouncements);

  const handleOnPin = useCallback(
    async (announcementId: string) => {
      const announcement = announcements.find(
        (announcement) => announcement.id === announcementId
      );

      if (!announcement) return;

      const draft = structuredClone(announcement);

      draft.pin_at_the_top.value = !draft.pin_at_the_top.value;
      draft.pin_at_the_top.updatedAt = new Date().toISOString();
      draft.updatedAt = new Date().toISOString();

      const updatedInformationBoard = structuredClone(informationBoard);

      const index = updatedInformationBoard.information.announcements.findIndex(
        (item) => item.id === draft.id
      );

      updatedInformationBoard.information.announcements[index] = draft;

      await dbInformationBoardSave(updatedInformationBoard);
    },
    [announcements, informationBoard]
  );

  const handleOnDelete = useCallback(
    async (announcementId: string) => {
      const announcement = announcements.find(
        (announcement) => announcement.id === announcementId
      );

      if (!announcement) return;

      const draft = structuredClone(announcement);

      draft._deleted = true;
      draft.updatedAt = new Date().toISOString();

      const updatedInformationBoard = structuredClone(informationBoard);

      const index = updatedInformationBoard.information.announcements.findIndex(
        (item) => item.id === draft.id
      );

      updatedInformationBoard.information.announcements[index] = draft;

      await dbInformationBoardSave(updatedInformationBoard);
    },
    [announcements, informationBoard]
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
          <Typography className="body-regular" color="var(--black)">
            {announcement.text}
          </Typography>
        }
        onPin={() => handleOnPin(announcement.id)}
        date={new Date(announcement.updatedAt)}
        onDelete={isAdmin ? () => handleOnDelete(announcement.id) : undefined}
      />
    ));
  }, [announcementsForThisPage, handleOnDelete, handleOnPin, isAdmin]);

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
          <Typography className="body-regular" color="var(--black)">
            {announcement.text}
          </Typography>
        }
        onPin={() => handleOnPin(announcement.id)}
        date={new Date(announcement.updatedAt)}
        onDelete={isAdmin ? () => handleOnDelete(announcement.id) : undefined}
      />
    ));
  }, [announcementsForThisPage, handleOnDelete, handleOnPin, isAdmin]);

  return {
    pinnedAnnouncements,
    unpinnedAnnouncements,
  };
};

export default useIBPageAnnouncements;
