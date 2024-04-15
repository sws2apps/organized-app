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
import { Setting } from '../../classes/Setting';

const DataStorage = () => {
  const { t } = useTranslation('ui');

  const setIsDeleteDb = useSetRecoilState(isDeleteDbOpenState);

  const [isAutoBackup, setIsAutoBackup] = useState(false);
  const [backupInterval, setBackupInterval] = useState(5);

  const approvedRole =
    Setting.cong_role.includes('lmmo') ||
    Setting.cong_role.includes('lmmo-backup') ||
    Setting.cong_role.includes('secretary') ||
    Setting.cong_role.includes('coordinator') ||
    Setting.cong_role.includes('public_talk_coordinator') ||
    Setting.cong_role.includes('publisher') ||
    Setting.cong_role.includes('ms') ||
    Setting.cong_role.includes('elder');
  const minLabel = t('minuteShortLabel');

  const handleAutoBackupChange = async (value) => {
    setIsAutoBackup(value);
    await Setting.update({ autoBackup: value });
    backupWorkerInstance.setIsEnabled(value);
  };

  const handleBackupIntervalChange = async (value) => {
    setBackupInterval(value);
    await Setting.update({ autoBackup_interval: value });
    backupWorkerInstance.setBackupInterval(value);
  };

  const handleDelete = () => {
    setIsDeleteDb(true);
  };

  useEffect(() => {
    setIsDeleteDb(false);
  }, [setIsDeleteDb]);

  useEffect(() => {
    setIsAutoBackup(Setting.autoBackup);
    setBackupInterval(Setting.autoBackup_interval || 5);
  }, []);

  return (
    <>
      <DialogDbDeletion />
      <Typography className={'settingHeader'}>{t('dataStorage')}</Typography>
      <Divider sx={{ borderWidth: '5px' }} />
      <Box sx={{ padding: '20px 20px' }}>
        {approvedRole && (
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
                defaultValue={5}
                value={backupInterval}
                onChange={(e) => handleBackupIntervalChange(e.target.value)}
              >
                {[5, 15, 30, 45].map((time) => (
                  <MenuItem key={time} value={time}>
                    {`${time} ${minLabel}`}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
        )}

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
