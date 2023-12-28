import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import S140PartMiniLabel from './S140PartMiniLabel';

const S140MeetingPartText = ({ partType, partText, partDuration, partMiniLabel, align }) => {
  return (
    <Box sx={{ width: '400px', display: 'flex', justifyContent: 'space-between' }}>
      <Box sx={{ lineHeight: '20px' }}>
        <ul className="ulSchedule">
          <li className={partType}>
            <Typography
              sx={{
                fontSize: '13px',
                color: 'black',
                lineHeight: 1.2,
              }}
            >
              {partText}
              {partDuration && <span className="student-part-duration">{` (${partDuration})`}</span>}
            </Typography>
          </li>
        </ul>
      </Box>
      {partMiniLabel && <S140PartMiniLabel label={partMiniLabel} align={align} />}
    </Box>
  );
};

export default S140MeetingPartText;
