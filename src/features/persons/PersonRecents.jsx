import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { dbRecentStudents } from '../../indexedDb/dbPersons';
import Box from '@mui/material/Box';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import PersonCard from './PersonCard';

const StudentRecents = () => {
  const { t } = useTranslation('ui');

  const [recentStudents, setRecentStudents] = useState([]);

  const clearRecentsStudents = () => {
    localStorage.removeItem('recentStudents');
    setRecentStudents([]);
  };

  useEffect(() => {
    const buildRecentStudents = async () => {
      const data = await dbRecentStudents(localStorage.getItem('recentStudents'));
      setRecentStudents(data);
    };

    buildRecentStudents();
  }, []);

  return (
    <Box sx={{ marginBottom: `${recentStudents.length > 0 ? '70px' : 0}` }}>
      {recentStudents.length > 0 && (
        <>
          <Grid container>
            {recentStudents.map((person) => (
              <PersonCard key={person.person_uid} person={person} />
            ))}
          </Grid>
          <Box sx={{ '& > :not(style)': { m: 1 } }}>
            <Fab variant="extended" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={clearRecentsStudents}>
              <ClearAllIcon sx={{ mr: 1 }} />
              {t('clearRecents')}
            </Fab>
          </Box>
        </>
      )}
    </Box>
  );
};

export default StudentRecents;
