import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import FieldServiceGroupItem from './FieldServiceGroupItem';
import { FSGList } from '../../classes/FSGList';

const FieldServiceGroupList = ({ currentList }) => {
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
        <IconButton aria-label="right" color="success" onClick={handleAddNewGroup} sx={{ border: '1px dashed' }}>
          <AddIcon sx={{ fontSize: '100px' }} />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default FieldServiceGroupList;
