import { Box } from '@mui/material';
import { generateDateFromTime } from '@utils/date';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { CongregationInfoEditType } from './index.types';
import useEdit from './useEdit';
import ContactDetails from '../../contact_details';
import MeetingTime from '../../meeting_time';
import TextField from '@components/textfield';
import Typography from '@components/typography';

const CongregationInfoEdit = ({ cong_number }: CongregationInfoEditType) => {
  const { t } = useAppTranslation();

  const { tabletDown } = useBreakpoints();

  const {
    handleMidweekTimeChange,
    handleMidweekWeekdayChange,
    handleAddressChange,
    congregation,
    address,
    circuit,
    handleCircuitChange,
    handleWeekendTimeChange,
    handleWeekendWeekdayChange,
    coordinatorEmail,
    coordinatorName,
    coordinatorPhone,
    handleCoordinatorEmailChange,
    handleCoordinatorNameChange,
    handleCoordinatorPhoneChange,
    handleTalkCoordinatorEmailChange,
    handleTalkCoordinatorNameChange,
    handleTalkCoordinatorPhoneChange,
    talkCoordinatorEmail,
    talkCoordinatorName,
    talkCoordinatorPhone,
  } = useEdit(cong_number);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Typography className="body-small-semibold" color="var(--grey-400)">
        {t('tr_meetingDetails')}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          alignItems: tabletDown ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          flexDirection: tabletDown ? 'column' : 'row',
        }}
      >
        <TextField
          label={t('tr_kingdomHallAddress')}
          value={address}
          onChange={(e) => handleAddressChange(e.target.value)}
        />
        <TextField
          label={t('tr_circuitNumber')}
          sx={{ maxWidth: tabletDown ? '100%' : '146px' }}
          value={circuit}
          onChange={(e) => handleCircuitChange(e.target.value)}
        />
      </Box>

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

      <Typography className="body-small-semibold" color="var(--grey-400)">
        {t('tr_contactPersons')}
      </Typography>

      <Box sx={{ borderBottom: '1px solid var(--accent-200)', paddingBottom: '16px', marginBottom: '8px' }}>
        <ContactDetails
          label={t('tr_coordinator')}
          hideLabel={true}
          name={coordinatorName}
          onNameChange={handleCoordinatorNameChange}
          email={coordinatorEmail}
          onEmailChange={handleCoordinatorEmailChange}
          phone={coordinatorPhone}
          onPhoneChange={handleCoordinatorPhoneChange}
        />
      </Box>

      <ContactDetails
        label={t('tr_publicTalkCoordinator')}
        hideLabel={true}
        name={talkCoordinatorName}
        onNameChange={handleTalkCoordinatorNameChange}
        email={talkCoordinatorEmail}
        onEmailChange={handleTalkCoordinatorEmailChange}
        phone={talkCoordinatorPhone}
        onPhoneChange={handleTalkCoordinatorPhoneChange}
      />
    </Box>
  );
};

export default CongregationInfoEdit;
