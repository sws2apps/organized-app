import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { GroupDeleteProps } from './index.types';
import useGroupDelete from './useGroupDelete';
import Button from '@components/button';
import Typography from '@components/typography';

const GroupDelete = (props: GroupDeleteProps) => {
  const { t } = useAppTranslation();

  const { handleDeleteGroup } = useGroupDelete(props);

  return (
    <>
      <Stack spacing="16px">
        <Typography className="h2">
          {t('tr_deleteServiceGroupTitle', { GroupNumber: props.index })}
        </Typography>

        <Typography color="var(--grey-400)">
          {t('tr_deleteServiceGroupDesc')}
        </Typography>
      </Stack>

      <Stack spacing="8px" width="100%">
        <Button variant="main" color="red" onClick={handleDeleteGroup}>
          {t('tr_delete')}
        </Button>
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_cancel')}
        </Button>
      </Stack>
    </>
  );
};

export default GroupDelete;
