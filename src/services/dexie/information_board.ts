import appDb from '@db/appDb';
import {
  InfoBoardAnnouncementType,
  InformationBoardType,
} from '@definition/information_board';

export const dbInformationBoardGet = async () => {
  const current = await appDb.information_board.get(1);
  return current;
};

export const dbInformationBoardUpdateAnnouncement = async (
  announcementId: string,
  update: (announcement: InfoBoardAnnouncementType) => void
) => {
  await appDb.transaction(
    'rw',
    appDb.information_board,
    appDb.metadata,
    async () => {
      const board = await appDb.information_board.get(1);

      if (!board) return;

      const announcement = board.information.announcements.find(
        (item) => item.id === announcementId
      );

      if (!announcement) return;

      update(announcement);

      await appDb.information_board.put(board);

      const metadata = await appDb.metadata.get(1);

      if (!metadata) return;

      metadata.metadata.information_board = {
        ...metadata.metadata.information_board,
        send_local: true,
      };

      await appDb.metadata.put(metadata);
    }
  );
};

export const dbInformationBoardSave = async (
  informationBoard: InformationBoardType
) => {
  await appDb.transaction(
    'rw',
    appDb.information_board,
    appDb.metadata,
    async () => {
      await appDb.information_board.put(informationBoard);

      const metadata = await appDb.metadata.get(1);

      if (!metadata) return;

      metadata.metadata.information_board = {
        ...metadata.metadata.information_board,
        send_local: true,
      };

      await appDb.metadata.put(metadata);
    }
  );
};
