import { useAppTranslation } from '@hooks/index';
import { RemovePersonProps } from './index.types';
import useRemovePerson from './useRemovePerson';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import Markup from '@components/text_markup';

const RemovePerson = (props: RemovePersonProps) => {
  const { t } = useAppTranslation();

  const { group_name, person_name } = useRemovePerson(props);

  return (
    <Dialog
      onClose={props.onClose}
      open={props.open}
      title={t('tr_removePublisher', { PersonName: person_name })}
    >
      <Markup
        className="body-regular"
        color="var(--grey-400)"
        content={t('tr_groupRemoveConfirm', { group: group_name })}
      />

      <DialogActions>
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_cancel')}
        </Button>
        <Button variant="main" color="red" onClick={props.action}>
          {t('tr_remove')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RemovePerson;
