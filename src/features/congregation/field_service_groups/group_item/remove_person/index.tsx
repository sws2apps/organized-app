import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { RemovePersonProps } from './index.types';
import useRemovePerson from './useRemovePerson';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Markup from '@components/text_markup';
import Typography from '@components/typography';

const RemovePerson = (props: RemovePersonProps) => {
  const { t } = useAppTranslation();

  const { group_name, person_name } = useRemovePerson(props);

  return (
    <Dialog onClose={props.onClose} open={props.open} sx={{ padding: '24px' }}>
      <Stack spacing="16px">
        <Typography className="h2">
          {t('tr_removePublisher', { PersonName: person_name })}
        </Typography>

        <Markup
          className="body-regular"
          color="var(--grey-400)"
          content={t('tr_groupRemoveConfirm', { group: group_name })}
        />
      </Stack>

      <Stack spacing="8px" width="100%">
        <Button variant="main" color="red" onClick={props.action}>
          {t('tr_remove')}
        </Button>
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_cancel')}
        </Button>
      </Stack>
    </Dialog>
  );
};

export default RemovePerson;
