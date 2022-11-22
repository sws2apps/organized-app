import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Typography from '@mui/material/Typography';
import { DialogDbDeletion } from './';
import { isDeleteDbOpenState } from '../../states/main';

const DataStorage = () => {
  const { t } = useTranslation();

  const setIsDeleteDb = useSetRecoilState(isDeleteDbOpenState);

  const handleDelete = () => {
    setIsDeleteDb(true);
  };

  useEffect(() => {
    setIsDeleteDb(false);
  }, [setIsDeleteDb]);

  return (
    <>
      <DialogDbDeletion />
      <Typography className={'settingHeader'}>
        {t('settings.offlineDataStorage')}
      </Typography>
      <Divider sx={{ borderWidth: '5px' }} />
      <Box sx={{ padding: '20px 20px' }}>
        <Box>
          <Typography>{t('settings.eraseDesc')}</Typography>
        </Box>
        <Button
          variant='contained'
          color='error'
          className={'btnSubItem'}
          startIcon={<DeleteForeverIcon />}
          onClick={() => handleDelete()}
          sx={{ marginTop: '10px'}}
        >
          {t('global.delete')}
        </Button>
      </Box>
    </>
  );
};

export default DataStorage;
