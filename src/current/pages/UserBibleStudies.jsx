import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Typography from '@mui/material/Typography';
import { BibleStudyAdd, BibleStudyItem } from '../features/userBibleStudies';
import { BibleStudies } from '../classes/BibleStudies';

const UserBibleStudies = () => {
  const { t } = useTranslation('ui');

  const [isAdd, setIsAdd] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);

  const bibleStudies = BibleStudies.list;

  const handleAddBibleStudy = () => {
    setIsAdd(true);
  };

  return (
    <Box>
      <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '20px', lineHeight: 1.2 }}>
        {t('myBibleStudies')}
      </Typography>

      <Box sx={{ marginBottom: '100px' }}>
        <BibleStudyAdd isAdd={isAdd} close={() => setIsAdd(false)} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {bibleStudies.map((bibleStudy) => (
            <BibleStudyItem
              key={bibleStudy.uid}
              bibleStudy={bibleStudy}
              isRefresh={isRefresh}
              setIsRefresh={(value) => setIsRefresh(value)}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ '& > :not(style)': { m: 1 }, position: 'fixed', bottom: 20, right: 20 }}>
        <Fab aria-label="save" color="primary" onClick={handleAddBibleStudy}>
          <AddCircleIcon />
        </Fab>
      </Box>
    </Box>
  );
};

export default UserBibleStudies;
