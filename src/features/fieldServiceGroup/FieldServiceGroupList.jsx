import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import FieldServiceGroupItem from './FieldServiceGroupItem';
import { FSGList } from '../../classes/FSGList';

const FieldServiceGroupList = ({ currentList }) => {
  const { t } = useTranslation('ui');

  const currentFSG = FSGList.get(currentList);

  const [isRefresh, setIsRefresh] = useState(false);

  const handleAddNewGroup = async () => {
    await currentFSG.addNewGroup();
    setIsRefresh((prev) => !prev);
  };

  useEffect(() => {}, [isRefresh]);

  return (
    <Box sx={{ marginTop: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap', paddingBottom: '50px' }}>
      {currentFSG.groups.map((group, index) => (
        <FieldServiceGroupItem
          key={group.group_uid}
          currentList={currentList}
          group_index={index}
          group={group}
          allGroups={currentFSG.groups}
          isRefresh={isRefresh}
          setIsRefresh={(value) => setIsRefresh(value)}
        />
      ))}
      <Paper
        elevation={3}
        sx={{
          width: '350px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px dashed',
          height: '440px',
        }}
      >
        <Button
          variant="outlined"
          color="success"
          startIcon={<AddCircleIcon />}
          sx={{ textTransform: 'none' }}
          onClick={handleAddNewGroup}
        >
          {t('addNewFieldServiceGroup')}
        </Button>
      </Paper>
    </Box>
  );
};

export default FieldServiceGroupList;
