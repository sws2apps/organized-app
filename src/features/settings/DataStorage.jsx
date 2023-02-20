import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DialogDbDeletion } from './';
import backupWorkerInstance from '../../workers/backupWorker';
import { isDeleteDbOpenState } from '../../states/main';
import { dbGetAppSettings, dbUpdateAppSettings } from '../../indexedDb/dbAppSettings';

const DataStorage = () => {
  const { t } = useTranslation('ui');

  const setIsDeleteDb = useSetRecoilState(isDeleteDbOpenState);

  const [isAutoBackup, setIsAutoBackup] = useState(false);
  const [backupInterval, setBackupInterval] = useState(1);

  const handleAutoBackupChange = async (value) => {
    setIsAutoBackup(value);
    await dbUpdateAppSettings({ autoBackup: value });
    backupWorkerInstance.setIsEnabled(value);
  };

  const handleBackupIntervalChange = async (value) => {
    setBackupInterval(value);
    await dbUpdateAppSettings({ autoBackup_interval: value });
    backupWorkerInstance.setBackupInterval(value);
  };

  const handleDelete = () => {
    setIsDeleteDb(true);
  };

  useEffect(() => {
    setIsDeleteDb(false);
  }, [setIsDeleteDb]);

  useEffect(() => {
    const fillDetails = async () => {
      const settings = await dbGetAppSettings();
      setIsAutoBackup(settings.autoBackup);
      setBackupInterval(settings.autoBackup_interval || 1);
    };

    fillDetails();
  }, []);

  return (
    <>
      <DialogDbDeletion />
      <Typography className={'settingHeader'}>{t('dataStorage')}</Typography>
      <Divider sx={{ borderWidth: '5px' }} />
      <Box sx={{ padding: '20px 20px' }}>
        <Box sx={{ marginBottom: '20px' }}>
          <Typography sx={{ fontWeight: 'bold' }}>{t('autoBackup')}</Typography>
          <Box sx={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <FormControlLabel
              control={<Checkbox checked={isAutoBackup} onChange={(e) => handleAutoBackupChange(e.target.checked)} />}
              label={t('enableLabel')}
            />
            <TextField
              id="outlined-select-backup-time"
              select
              label={t('backupIntervalLabel')}
              size="small"
              sx={{ minWidth: '130px' }}
              defaultValue={1}
              value={backupInterval}
              onChange={(e) => handleBackupIntervalChange(e.target.value)}
            >
              {[1, 5, 15, 30].map((time) => (
                <MenuItem key={time} value={time}>
                  {time} min.
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
        <Box>
          <Typography>{t('eraseDesc')}</Typography>
          <Button
            variant="contained"
            color="error"
            className={'btnSubItem'}
            startIcon={<DeleteForeverIcon />}
            onClick={() => handleDelete()}
            sx={{ marginTop: '10px' }}
          >
            {t('delete')}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default DataStorage;
