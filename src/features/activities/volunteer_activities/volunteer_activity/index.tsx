import { Box, IconButton } from '@mui/material';
import {
  IconCancelCicle,
  IconEdit,
  IconExpand,
  IconPerson,
  IconRaiseHand,
} from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { VolunteerActivityProps } from './index.types';
import useVolunteerActivity from './useVolunteerActivity';
import Accordion from '@components/accordion';
import Button from '@components/button';
import Divider from '@components/divider';
import EditActivity from '../edit_activity';
import ProgressBarSmall from '@components/progress_bar_small';
import Typography from '@components/typography';

const VolunteerActivity = (props: VolunteerActivityProps) => {
  const { t } = useAppTranslation();
  const { tabletUp } = useBreakpoints();

  const {
    isAdmin,
    canJoin,
    isEdit,
    participants,
    joined,
    joinDisabled,
    joinLabel,
    dateFormatted,
    timeFormatted,
    handleToggleEdit,
    handleSaveActivity,
    handleToggleJoin,
  } = useVolunteerActivity(props);

  const { activity_uid, activity_data } = props.data;

  if (isEdit) {
    return (
      <EditActivity
        data={props.data}
        type="edit"
        participantsCount={participants.length}
        onSave={handleSaveActivity}
        onCancel={handleToggleEdit}
      />
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: 'var(--white)',
        border: '1px solid var(--accent-300)',
        borderRadius: 'var(--radius-xl)',
        padding: tabletUp ? '24px' : '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <Typography className="h2">{dateFormatted}</Typography>

        {isAdmin && (
          <IconButton sx={{ padding: 0 }} onClick={handleToggleEdit}>
            <IconEdit color="var(--accent-main)" />
          </IconButton>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: tabletUp ? 'row' : 'column',
          alignItems: tabletUp ? 'center' : 'stretch',
          gap: '16px',
        }}
      >
        <Box sx={{ display: 'flex', gap: '16px', flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              backgroundColor: 'var(--accent-150)',
              borderRadius: 'var(--radius-s)',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <Typography
              className="body-small-semibold"
              color="var(--accent-dark)"
            >
              {timeFormatted}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              minWidth: 0,
            }}
          >
            <Typography className="h4" sx={{ overflowWrap: 'anywhere' }}>
              {activity_data.name}
            </Typography>

            {activity_data.description && (
              <Typography
                className="body-small-regular"
                color="var(--grey-400)"
                sx={{ overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}
              >
                {activity_data.description}
              </Typography>
            )}
          </Box>
        </Box>

        {canJoin && (
          <Button
            variant="tertiary"
            disabled={joinDisabled}
            startIcon={joined ? <IconCancelCicle /> : <IconRaiseHand />}
            onClick={handleToggleJoin}
            sx={{ flexShrink: 0 }}
          >
            {joinLabel}
          </Button>
        )}
      </Box>

      <Divider color="var(--accent-200)" />

      <Accordion
        id={`volunteer-activity-${activity_uid}`}
        summaryProps={{
          expandIcon: <IconExpand color="var(--accent-dark)" />,
          sx: {
            flexDirection: 'row-reverse',
            gap: '8px',
            '.MuiAccordionSummary-content': { margin: '0 !important' },
          },
        }}
        label={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              gap: '8px',
            }}
          >
            <Typography
              className="body-small-semibold"
              color="var(--accent-dark)"
              sx={{ flexShrink: 0 }}
            >
              {t('tr_participantsCount', {
                count: participants.length,
                goal: activity_data.participant_goal,
              })}
            </Typography>
            <ProgressBarSmall
              value={Math.min(
                participants.length,
                activity_data.participant_goal
              )}
              maxValue={activity_data.participant_goal}
            />
          </Box>
        }
      >
        {participants.length === 0 && (
          <Typography color="var(--grey-400)">
            {t('tr_noParticipantsYet')}
          </Typography>
        )}

        {participants.map((participant) => (
          <Box
            key={participant.uid}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              paddingBlock: '8px',
              '& + &': { borderTop: '1px solid var(--accent-200)' },
            }}
          >
            <IconPerson color="var(--grey-400)" />
            <Typography>{participant.name}</Typography>
          </Box>
        ))}
      </Accordion>
    </Box>
  );
};

export default VolunteerActivity;
