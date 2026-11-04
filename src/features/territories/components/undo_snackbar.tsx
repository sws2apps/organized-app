import { useAppTranslation } from '@hooks/index';
import { useAtomValue } from 'jotai';
import SnackBar from '@components/snackbar';
import { IconUndo } from '@icons/index';
import {
  dismissUndo,
  undoLast,
  undoOfferState,
} from '@features/territories/undo';

// rendered once by the app shell, for every page's offer
const UndoSnackbar = () => {
  const { t } = useAppTranslation();

  const offer = useAtomValue(undoOfferState);

  return (
    <SnackBar
      open={!!offer}
      variant="message-with-button"
      messageHeader={offer?.text ?? ''}
      message=""
      actionIcon={<IconUndo />}
      actionText={t('tr_territoryUndo')}
      actionClick={undoLast}
      onClose={dismissUndo}
    />
  );
};

export default UndoSnackbar;
