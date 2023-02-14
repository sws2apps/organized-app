import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { sourceLangState } from '../../states/main';
import { classCountState } from '../../states/congregation';

const S140MeetingPartHeading = ({ meetingPart, topLabel, bgColor, weekType }) => {
  const { t } = useTranslation('source');

  const sourceLang = useRecoilValue(sourceLangState);
  const classCount = useRecoilValue(classCountState);

  return (
    <Box sx={{ display: 'flex', margin: '8px 0 3px 0' }}>
      <Typography
        sx={{
          color: 'white',
          fontWeight: 'bold',
          fontSize: '12px',
          padding: '0 0 0 6px',
          backgroundColor: bgColor,
          width: '440px',
          lineHeight: '20px',
          textTransform: 'uppercase',
        }}
      >
        {t(meetingPart, { lng: sourceLang })}
      </Typography>
      <Typography
        sx={{
          color: '#424949',
          fontSize: '9px',
          fontWeight: 'bold',
          padding: '0 0 0 8px',
          width: '180px',
          lineHeight: '20px',
        }}
      >
        {topLabel && classCount === 2 && weekType !== 2 ? t('auxClass', { lng: sourceLang }) : ''}
      </Typography>
      <Typography
        sx={{
          color: '#424949',
          fontSize: '9px',
          fontWeight: 'bold',
          padding: '0 0 0 8px',
          width: '180px',
          lineHeight: '20px',
        }}
      >
        {topLabel && t('mainHall', { lng: sourceLang })}
      </Typography>
    </Box>
  );
};

export default S140MeetingPartHeading;
