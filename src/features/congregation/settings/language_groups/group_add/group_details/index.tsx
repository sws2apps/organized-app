import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { GroupDetailsProps } from './index.types';
import useGroupDetails from './useGroupDetails';
import Button from '@components/button';
import DialogActions from '@components/dialog_actions';
import Typography from '@components/typography';
import LanguageGroupDetails from '../../group_details';

const GroupDetails = (props: GroupDetailsProps) => {
  const { t } = useAppTranslation();

  const { handleNameChange, name, handleLanguageChange, language } =
    useGroupDetails(props);

  return (
    <Stack spacing="24px" width="100%">
      <Typography color="var(--grey-400)">
        {t('tr_addNewLangGroupDesc')}
      </Typography>

      <LanguageGroupDetails
        name={name}
        onNameChange={handleNameChange}
        circuit={props.circuit}
        onCircuitChange={props.onCircuitChange}
        language={language}
        onLanguageChange={handleLanguageChange}
      />

      <DialogActions>
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_cancel')}
        </Button>
        <Button variant="main" onClick={props.onAction}>
          {t('tr_next')}
        </Button>
      </DialogActions>
    </Stack>
  );
};

export default GroupDetails;
