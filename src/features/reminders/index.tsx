import { Box, IconButton, Slide, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { IconClose, IconReminder } from '@components/icons';
import {
  StyledRemindersCard,
  StyledRemindersFooter,
  StyledRemindersTitle,
} from './index.styles';
import useReminders from './useReminders';
import Button from '@components/button';
import Typography from '@components/typography';
import Divider from '@components/divider';
import ReminderItem from './reminder_item';

const AppReminders = () => {
  const { t } = useAppTranslation();

  const { tablet688Up } = useBreakpoints();

  const { reminders, reminderMeTomorrow } = useReminders();

  return (
    <Slide
      direction="left"
      in={reminders.length > 0}
      mountOnEnter
      unmountOnExit
    >
      <StyledRemindersCard
        className="warning-glow"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 2,
          left: tablet688Up ? 'unset' : '15px',
          maxWidth: tablet688Up ? '500px' : 'unset',
        }}
      >
        <StyledRemindersTitle>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <IconReminder color="var(--always-white)" />
            <Typography className="h4" color="var(--always-white)">
              {t('tr_reminders')}
            </Typography>
          </Box>
          <IconButton sx={{ padding: 0 }} onClick={reminderMeTomorrow}>
            <IconClose color="var(--always-white)" />
          </IconButton>
        </StyledRemindersTitle>

        <Stack
          spacing="8px"
          divider={
            <Divider color="var(--always-white)" sx={{ opacity: 0.32 }} />
          }
        >
          {reminders.map((reminder) => (
            <ReminderItem
              key={reminder.id}
              title={reminder.title}
              description={reminder.description}
              path={reminder.path}
            />
          ))}
        </Stack>

        <StyledRemindersFooter>
          <Button variant="main" color="orange" onClick={reminderMeTomorrow}>
            {t('tr_remindMeTomorrow')}
          </Button>
        </StyledRemindersFooter>
      </StyledRemindersCard>
    </Slide>
  );
};

export default AppReminders;
