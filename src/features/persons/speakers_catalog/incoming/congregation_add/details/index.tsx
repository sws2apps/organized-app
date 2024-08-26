import { Box } from '@mui/material';
import { CongregationDetailsType } from './index.types';
import { generateDateFromTime } from '@utils/date';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import ContactDetails from '../../contact_details';
import MeetingTime from '../../meeting_time';
import TextField from '@components/textfield';
import Typography from '@components/typography';

const CongregationDetails = ({
  congregation,
  handleCongAddressChange,
  handleMidweekWeekdayChange,
  handleMidweekTimeChange,
  handleWeekendWeekdayChange,
  handleWeekendTimeChange,
  handleTalkCoordinatorNameChange,
  handleCoordinatorEmailChange,
  handleCoordinatorNameChange,
  handleCoordinatorPhoneChange,
  handleTalkCoordinatorEmailChange,
  handleTalkCoordinatorPhoneChange,
  handleIncomingCongregationAdd,
  handleMovePrevious,
}: CongregationDetailsType) => {
  const { t } = useAppTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Typography className="h2">{t('tr_congregationDetails')}</Typography>
      <Typography color="var(--grey-400)" sx={{ marginBottom: '8px' }}>
        {t('tr_congregationDetailsDesc')}
      </Typography>

      <TextField
        label={t('tr_kingdomHallAddress')}
        value={congregation.cong_location.address}
        onChange={(e) => handleCongAddressChange(e.target.value)}
      />

      <MeetingTime
        label={t('tr_midweekMeeting')}
        weekday={congregation.midweek_meeting.weekday.value}
        onWeekdayChange={handleMidweekWeekdayChange}
        time={generateDateFromTime(congregation.midweek_meeting.time.value)}
        onTimeChange={handleMidweekTimeChange}
      />

      <MeetingTime
        label={t('tr_weekendMeeting')}
        weekday={congregation.weekend_meeting.weekday.value}
        onWeekdayChange={handleWeekendWeekdayChange}
        time={generateDateFromTime(congregation.weekend_meeting.time.value)}
        onTimeChange={handleWeekendTimeChange}
      />

      <ContactDetails
        label={t('tr_publicTalkCoordinator')}
        name={congregation.public_talk_coordinator.name}
        onNameChange={handleTalkCoordinatorNameChange}
        email={congregation.public_talk_coordinator.email}
        onEmailChange={handleTalkCoordinatorEmailChange}
        phone={congregation.public_talk_coordinator.phone}
        onPhoneChange={handleTalkCoordinatorPhoneChange}
      />

      <ContactDetails
        label={t('tr_coordinator')}
        name={congregation.coordinator.name}
        onNameChange={handleCoordinatorNameChange}
        email={congregation.coordinator.email}
        onEmailChange={handleCoordinatorEmailChange}
        phone={congregation.coordinator.phone}
        onPhoneChange={handleCoordinatorPhoneChange}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
        }}
      >
        <Button variant="main" onClick={handleIncomingCongregationAdd}>
          {t('tr_addCongregation')}
        </Button>
        <Button variant="secondary" onClick={handleMovePrevious}>
          {t('tr_back')}
        </Button>
      </Box>
    </Box>
  );
};

export default CongregationDetails;
