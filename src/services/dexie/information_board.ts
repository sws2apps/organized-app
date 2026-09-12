import appDb from '@db/appDb';
import { InformationBoardType } from '@definition/information_board';

export const dbInformationBoardGet = async () => {
  const current = await appDb.information_board.get(1);
  return current;
};

export const dbInformationBoardSave = async (
  informationBoard: InformationBoardType
) => {
  await appDb.information_board.put(informationBoard);

  const metadata = await appDb.metadata.get(1);

  if (!metadata) return;

  metadata.metadata.information_board = {
    ...metadata.metadata.information_board,
    send_local: true,
  };

  await appDb.metadata.put(metadata);
};
