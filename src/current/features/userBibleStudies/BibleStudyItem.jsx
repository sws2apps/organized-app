import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import Chip from '@mui/material/Chip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { BibleStudies } from '../../classes/BibleStudies';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';

const BibleStudyItem = ({ bibleStudy, isRefresh, setIsRefresh }) => {
  const { t } = useTranslation('ui');

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const [isEdit, setIsEdit] = useState(false);
  const [personName, setPersonName] = useState(bibleStudy.person_name);
  const [personContact, setPersonContact] = useState(bibleStudy.person_contact);
  const [personAddress, setPersonAddress] = useState(bibleStudy.person_addresses);

  const handleSave = async () => {
    if (personName === '') {
      setAppMessage(t('missingInfo'));
      setAppSeverity('warning');
      setAppSnackOpen(true);

      return;
    }

    const currentBS = BibleStudies.get(bibleStudy.uid);
    await currentBS.save({ person_name: personName, person_contact: personContact, person_addresses: personAddress });

    setIsEdit(false);
    setIsRefresh(!isRefresh);
  };

  const handleDelete = async () => {
    const currentBS = BibleStudies.get(bibleStudy.uid);

    const isActive = currentBS.isActive();

    if (isActive) {
      await currentBS.setInactive();

      setAppMessage(t('inactiveBibleStudyWarning'));
      setAppSeverity('warning');
      setAppSnackOpen(true);
      setIsRefresh(!isRefresh);
      return;
    }

    await BibleStudies.delete(bibleStudy.uid);
    setIsRefresh(!isRefresh);
  };

  const handleSetActive = async () => {
    const currentBS = BibleStudies.get(bibleStudy.uid);
    await currentBS.setActive();
    setIsRefresh(!isRefresh);
  };

  return (
    <Box
      sx={{
        border: '1px outset',
        borderRadius: '5px',
        padding: '15px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
      }}
    >
      <Chip
        color={bibleStudy.person_active ? 'success' : 'warning'}
        sx={{ width: 'fit-content' }}
        label={bibleStudy.person_active ? t('activeBibleStudy') : t('inactiveBibleStudy')}
      />
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px', flexGrow: 1 }}>
          <Box sx={{ maxWidth: '350px', minWidth: '240px', flexGrow: 1 }}>
            {!isEdit && <Typography>{bibleStudy.person_name}</Typography>}
            {isEdit && (
              <TextField
                label={t('name')}
                variant="outlined"
                size="small"
                fullWidth={true}
                sx={{ maxWidth: '350px' }}
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
              />
            )}
          </Box>
          <Box sx={{ maxWidth: '350px', minWidth: '240px', flexGrow: 1 }}>
            {!isEdit && <Typography>{bibleStudy.person_contact}</Typography>}
            {isEdit && (
              <TextField
                label={t('contact')}
                variant="outlined"
                size="small"
                fullWidth={true}
                sx={{ maxWidth: '350px' }}
                value={personContact}
                onChange={(e) => setPersonContact(e.target.value)}
              />
            )}
          </Box>
          <Box sx={{ maxWidth: '350px', minWidth: '240px', flexGrow: 1 }}>
            {!isEdit && <Typography>{bibleStudy.person_addresses}</Typography>}
            {isEdit && (
              <TextField
                label={t('address')}
                variant="outlined"
                size="small"
                fullWidth={true}
                sx={{ maxWidth: '350px' }}
                multiline={true}
                rows={2}
                value={personAddress}
                onChange={(e) => setPersonAddress(e.target.value)}
              />
            )}
          </Box>
        </Box>

        <Box>
          {!isEdit && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {bibleStudy.person_active && (
                <Button variant="outlined" color="primary" startIcon={<EditIcon />} onClick={() => setIsEdit(true)}>
                  {t('edit')}
                </Button>
              )}

              <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDelete}>
                {t('delete')}
              </Button>
            </Box>
          )}

          {!bibleStudy.person_active && (
            <Button
              variant="outlined"
              color="success"
              startIcon={<HealthAndSafetyIcon />}
              sx={{ marginRight: '8px' }}
              onClick={handleSetActive}
            >
              {t('enableLabel')}
            </Button>
          )}

          {isEdit && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <Button variant="outlined" color="success" startIcon={<SaveIcon />} onClick={handleSave}>
                {t('save')}
              </Button>
              <Button variant="outlined" color="secondary" startIcon={<CancelIcon />} onClick={() => setIsEdit(false)}>
                {t('cancel')}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default BibleStudyItem;
