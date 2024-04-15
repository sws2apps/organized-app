import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FSGList } from '../classes/FSGList';
import { FieldServiceGroupList } from '../features/fieldServiceGroup';

const FieldServiceGroup = () => {
  const { t } = useTranslation('ui');

  const [isRefresh, setIsRefresh] = useState(false);
  const [currentList, setCurrentList] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);

  const handleCreateNewList = async () => {
    await FSGList.add();
    setCurrentList(FSGList.list[FSGList.list.length - 1].fieldServiceGroup_uid);
    setIsRefresh((prev) => !prev);
  };

  const handleDeleteList = async () => {
    await FSGList.delete(currentList);
    setCurrentList('');
    handleGetCurrentList();
    setIsRefresh((prev) => !prev);
  };

  const handleSetCurrent = async () => {
    await FSGList.setCurrentList(currentList);
    handleGetCurrentList();
    setIsRefresh((prev) => !prev);
  };

  const handleGetCurrentList = () => {
    let tmpList = FSGList.list.find((item) => item.isCurrent)?.fieldServiceGroup_uid;
    if (!tmpList) {
      tmpList = FSGList.list.length === 0 ? '' : FSGList.list[FSGList.list.length - 1].fieldServiceGroup_uid;
    }

    setCurrentList(tmpList);
  };

  useEffect(() => {
    handleGetCurrentList();
  }, []);

  useEffect(() => {
    if (currentList !== '') {
      const isCurrent = FSGList.list.find((item) => item.fieldServiceGroup_uid === currentList).isCurrent;
      setIsCurrent(isCurrent);
    }
  }, [currentList, isRefresh]);

  useEffect(() => {}, [isRefresh]);

  return (
    <Box>
      <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '20px' }}>
        {t('fieldServiceGroup')}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {FSGList.list.length > 0 && (
          <TextField
            id="outlined-select-status"
            select
            size="small"
            sx={{ minWidth: '200px' }}
            defaultValue=""
            value={currentList}
            onChange={(e) => setCurrentList(e.target.value)}
          >
            {FSGList.list.map((item, index) => (
              <MenuItem key={item.fieldServiceGroup_uid} value={item.fieldServiceGroup_uid}>
                {item.isCurrent ? t('currentList') : t('draftFieldServiceGroupList', { index: index + 1 })}
              </MenuItem>
            ))}
          </TextField>
        )}
        {currentList !== '' && !isCurrent && (
          <Button variant="outlined" color="success" startIcon={<CheckCircleIcon />} onClick={handleSetCurrent}>
            {t('setAsCurrent')}
          </Button>
        )}

        {currentList !== '' && !isCurrent && (
          <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDeleteList}>
            {t('delete')}
          </Button>
        )}

        <Button variant="outlined" color="info" startIcon={<AddCircleIcon />} onClick={handleCreateNewList}>
          {t('create')}
        </Button>
      </Box>
      {currentList !== '' && <FieldServiceGroupList currentList={currentList} />}
    </Box>
  );
};

export default FieldServiceGroup;
