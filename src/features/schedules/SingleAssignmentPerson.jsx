import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { dbGetStudentByDispName } from '../../indexedDb/dbPersons';
import { themeOptionsState } from '../../states/theme';

import maleIcon from '../../img/student_male.svg';
import femaleIcon from '../../img/student_female.svg';

const SingleAssignmentPerson = ({ person }) => {
  const theme = useTheme();

  const themeOptions = useRecoilValue(themeOptionsState);

  const [isMale, setIsMale] = useState(true);

  useEffect(() => {
    const getPerson = async () => {
      if (person && person !== '') {
        const dataPerson = await dbGetStudentByDispName(person);
        setIsMale(dataPerson.isMale);
      }
    };

    getPerson();
  }, [person]);

  return (
    <Box
      sx={{
        width: '190px',
        padding: '2px 2px 2px 5px',
        borderRadius: 5,
        backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.15),
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {person && person !== '' && (
        <Avatar
          sx={{
            height: '25px',
            width: '25px',
          }}
          alt="Student icon"
          src={isMale ? maleIcon : femaleIcon}
        />
      )}
      <Typography
        sx={{
          height: '30px',
          lineHeight: '30px',
          fontWeight: 'bold',
        }}
        variant="body1"
      >
        {person}
      </Typography>
    </Box>
  );
};

export default SingleAssignmentPerson;
