import { Box } from '@mui/material';
import { useNavigate } from 'react-router';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useHallAttendant from '@pages/meetings/hall_attendant/useHallAttendant';
import HallAttendance from '@features/meetings/hall_attendant/attendance';
import HallNotes from '@features/meetings/hall_attendant/info';
import PageTitle from '@components/page_title';
import Card from '@components/card';
import CardHeader from '@components/card_header';
import Typography from '@components/typography';
import Button from '@components/button';
import { IconE911Emergency } from '@components/icons';

const HallAttendant = () => {
  const { t } = useAppTranslation();
  const { desktopUp } = useBreakpoints();
  const navigate = useNavigate();
  const { meeting, dataView, time, date, meetingDate } = useHallAttendant();
  return (
    <>
      <PageTitle title={t('tr_hallAttendantMode')} />
      <Box
        sx={{
          display: 'grid',
          gap: '16px',
          alignItems: 'start',
          gridTemplateRows: desktopUp ? 'min-content 1fr auto' : undefined,
          gridTemplateColumns: desktopUp
            ? 'minmax(0, 1.25fr) minmax(0, 1fr)'
            : 'minmax(0, 1fr)',
        }}
      >
        <Box sx={{ gridColumn: 1, gridRow: 1 }}>
          <Card>
            <CardHeader header={t('tr_hallGeneralInfo')} />
            <Box>
              <Typography className="h1">{time}</Typography>
              <Typography color="var(--grey-400)">{date}</Typography>
            </Box>
          </Card>
        </Box>
        <Box
          sx={{
            gridColumn: desktopUp ? 2 : 1,
            gridRow: desktopUp ? '1 / 3' : 2,
          }}
        >
          <HallAttendance
            key={`${meeting.week}-${meeting.type}-${dataView}`}
            month={meeting.month}
            index={meeting.index}
            type={meeting.type}
            view={dataView}
            dateLabel={t('tr_hallMeetingDate', {
              meeting: t(
                meeting.type === 'midweek'
                  ? 'tr_midweekMeeting'
                  : 'tr_weekendMeeting'
              ),
              date: meetingDate,
            })}
          />
        </Box>
        <Box sx={{ gridColumn: 1, gridRow: desktopUp ? 2 : 3 }}>
          <HallNotes key={dataView} />
        </Box>
        <Card sx={{ gridColumn: '1 / -1', gridRow: desktopUp ? 3 : 4 }}>
          <CardHeader header={t('tr_hallEmergency')} color="red" />
          <Typography>{t('tr_hallEmergencyDescription')}</Typography>
          <Button
            color="red"
            startIcon={<IconE911Emergency />}
            onClick={() => navigate('/hall-attendant/emergency')}
          >
            {t('tr_hallEmergency')}
          </Button>
        </Card>
      </Box>
    </>
  );
};
export default HallAttendant;
