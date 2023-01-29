import { useRecoilValue } from 'recoil';
import { useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { themeOptionsState } from '../../states/theme';

const SingleAssignmentPerson = ({ person }) => {
  const theme = useTheme();

  const themeOptions = useRecoilValue(themeOptionsState);

  return (
    <Typography
      sx={{
        height: '25px',
        lineHeight: '25px',
        width: '165px',
        padding: '2px 2px 2px 5px',
        borderRadius: 5,
        fontWeight: 'bold',
        backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.15),
      }}
      variant="body1"
    >
      {person}
    </Typography>
  );
};

export default SingleAssignmentPerson;
