import { Box } from '@mui/material';
import { generateDateFromTime } from '@utils/date';
import { useAppTranslation } from '@hooks/index';
import { CongregationInfoEditType } from './index.types';
import useEdit from './useEdit';
import ContactDetails from '../../contact_details';
import MeetingTime from '../../meeting_time';
import TextField from '@components/textfield';
import Typography from '@components/typography';

const CongregationInfoEdit = ({ cong_number }: CongregationInfoEditType) => {
  const { t } = useAppTranslation();

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
    handleNameChange,
    handleNumberChange,
    name,
    number,
    cong_synced,
  } = useEdit(cong_number);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <TextField
        label={t('tr_congregationName')}
        value={name}
        onChange={(e) => handleNameChange(e.target.value)}
        slotProps={{ input: { readOnly: cong_synced } }}
      />

      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TextField
          label={t('tr_number')}
          value={number}
          onChange={(e) => handleNumberChange(e.target.value)}
          slotProps={{ input: { readOnly: cong_synced } }}
        />
        <TextField
          label={t('tr_circuitNumber')}
          value={circuit}
          onChange={(e) => handleCircuitChange(e.target.value)}
          slotProps={{ input: { readOnly: cong_synced } }}
        />
      </Box>

      <Typography className="body-small-semibold" color="var(--grey-400)">
        {t('tr_meetingDetails')}
      </Typography>

      <TextField
        label={t('tr_kingdomHallAddress')}
        value={address}
        onChange={(e) => handleAddressChange(e.target.value)}
      />

      <MeetingTime
        label={t('tr_midweekMeeting')}
        weekday={congregation!.cong_data.midweek_meeting.weekday.value}
        onWeekdayChange={handleMidweekWeekdayChange}
        time={generateDateFromTime(
          congregation!.cong_data.midweek_meeting.time.value
        )}
        onTimeChange={handleMidweekTimeChange}
      />

      <MeetingTime
        label={t('tr_weekendMeeting')}
        weekday={congregation!.cong_data.weekend_meeting.weekday.value}
        onWeekdayChange={handleWeekendWeekdayChange}
        time={generateDateFromTime(
          congregation!.cong_data.weekend_meeting.time.value
        )}
        onTimeChange={handleWeekendTimeChange}
      />

      <Typography className="body-small-semibold" color="var(--grey-400)">
        {t('tr_contactPersons')}
      </Typography>

      <Box
        sx={{
          borderBottom: '1px solid var(--accent-200)',
          paddingBottom: '16px',
          marginBottom: '8px',
        }}
      >
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
  );
};

export default CongregationInfoEdit;
