import { Box } from '@mui/material';
import { IconAdd } from '@components/icons';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useOutgoingTalks from './useOutgoingTalks';
import Button from '@components/button';
import ScheduleItem from './schedule_item';

const OutgoingTalks = () => {
  const { t } = useAppTranslation();

  const { isPublicTalkCoordinator } = useCurrentUser();

  const { selectedWeek, handleAddOutgoingTalk, outgoingTalkSchedules } =
    useOutgoingTalks();

  return (
    <>
      {selectedWeek.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            alignItems: 'flex-start',
          }}
        >
          {outgoingTalkSchedules.map((schedule) => (
            <ScheduleItem
              key={schedule.id}
              schedule={schedule}
              week={selectedWeek}
            />
          ))}

          {isPublicTalkCoordinator && (
            <Button
              variant="tertiary"
              startIcon={<IconAdd />}
              onClick={handleAddOutgoingTalk}
            >
              {t('tr_addOutgoingTalk')}
            </Button>
          )}
        </Box>
      )}
    </>
  );
};

export default OutgoingTalks;
