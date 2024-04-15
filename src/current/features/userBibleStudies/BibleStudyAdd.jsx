import { useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import Collapse from '@mui/material/Collapse';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { BibleStudies } from '../../classes/BibleStudies';

const BibleStudyAdd = ({ isAdd, close }) => {
  const { t } = useTranslation('ui');

  const personNameRef = useRef();
  const personContactRef = useRef();
  const personAddressRef = useRef();

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const handleAddPerson = async () => {
    const person_name = personNameRef.current.value;
    const person_contact = personContactRef.current.value;
    const person_addresses = personAddressRef.current.value;

    if (person_name === '') {
      setAppMessage(t('missingInfo'));
      setAppSeverity('warning');
      setAppSnackOpen(true);

      return;
    }

    await BibleStudies.create({ person_name, person_contact, person_addresses });
    close();
  };

  return (
    <Collapse
      in={isAdd}
      timeout="auto"
      unmountOnExit
      sx={{ borderBottom: '2px outset', marginBottom: '25px', paddingBottom: '25px' }}
    >
      <Box sx={{ width: '100%' }}>
        <Typography sx={{ fontSize: '1.2em', marginBottom: '15px' }}>{t('newRecord')}</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <TextField
            label={t('name')}
            variant="outlined"
            size="small"
            fullWidth={true}
            sx={{ maxWidth: '350px' }}
            inputRef={personNameRef}
          />
          <TextField
            label={t('contact')}
            variant="outlined"
            size="small"
            fullWidth={true}
            sx={{ maxWidth: '350px' }}
            inputRef={personContactRef}
          />
          <TextField
            label={t('address')}
            variant="outlined"
            size="small"
            fullWidth={true}
            sx={{ maxWidth: '350px' }}
            multiline={true}
            rows={2}
            inputRef={personAddressRef}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '20px' }}>
        <Button variant="outlined" color="success" startIcon={<SaveIcon />} onClick={handleAddPerson}>
          {t('save')}
        </Button>
        <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={close}>
          {t('cancel')}
        </Button>
      </Box>
    </Collapse>
  );
};

export default BibleStudyAdd;
