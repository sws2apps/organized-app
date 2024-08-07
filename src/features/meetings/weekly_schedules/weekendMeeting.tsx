import useAppTranslation from '@hooks/useAppTranslation';
import { Box } from '@mui/material';
import SchedulePickerHeader from './SchedulePickerHeader';
import {
  ScheduleDescription,
  ScheduleGrid,
  ScheduleHeader,
  ScheduleItem,
  ScheduleItemTitle,
  ScheduleMemberRow,
  ScheduleMembers,
  ScheduleSubtitle,
  ScheduleTitle,
  ScheduleWeekTitle,
} from './ScheduleComponents';
import { IconSong, IconTalker, IconWatchtowerStudy } from '@components/icons';

const WeekendMeeting = () => {
  const { t } = useAppTranslation();
  const lastUpdated = new Date().toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <SchedulePickerHeader lastUpdated={lastUpdated} />
      <ScheduleGrid>
        <ScheduleItemTitle>
          <ScheduleWeekTitle color="var(--black)">
            8 November 2023
          </ScheduleWeekTitle>
          <ScheduleMembers>
            <ScheduleMemberRow
              type={t('tr_chairman') + ':'}
              name="Jeremiah Green"
            />
          </ScheduleMembers>
        </ScheduleItemTitle>
        <ScheduleItem>
          <ScheduleTitle color="var(--black)">
            <IconSong color="var(--black)" />
            Song 109 – “Jehovah’s Warm Appeal: “Be Wise, My Son”
          </ScheduleTitle>
          <ScheduleMembers>
            <ScheduleMemberRow
              type={t('tr_prayer') + ':'}
              name="Jeremiah Green"
            />
          </ScheduleMembers>
        </ScheduleItem>
        <ScheduleHeader
          text={t('tr_publicTalk')}
          color="var(--weekend-meeting)"
          icon={<IconTalker />}
        />
        <ScheduleItem>
          <Box>
            <ScheduleTitle color="var(--weekend-meeting)">
              Public talk
            </ScheduleTitle>
            <ScheduleSubtitle isCopyable>
              “The Resurrection — Why That Hope Should Be Real to You”
            </ScheduleSubtitle>
          </Box>
          <ScheduleMembers>
            <ScheduleMemberRow name="Jeremiah Green" />
          </ScheduleMembers>
        </ScheduleItem>
        <ScheduleHeader
          text={t('tr_watchtowerStudy')}
          color="var(--watchtower-study)"
          icon={<IconWatchtowerStudy />}
        />

        <ScheduleItem>
          <ScheduleTitle color="var(--black)">
            <IconSong color="var(--black)" />
            Song 109 – “Jehovah’s Warm Appeal: “Be Wise, My Son”
          </ScheduleTitle>
        </ScheduleItem>
        <ScheduleItem>
          <Box>
            <ScheduleTitle cssCounter color="var(--black)">
              {t('tr_watchtowerStudy')}
            </ScheduleTitle>
            <ScheduleDescription>
              “Carry What You Must, and Throw Off the Rest”
            </ScheduleDescription>
          </Box>
          <ScheduleMembers>
            <ScheduleMemberRow
              type={t('tr_student') + ':'}
              name="Jeremiah Green"
            />
            <ScheduleMemberRow
              type={t('tr_assistantS89')}
              name="Jeremiah Green"
            />
          </ScheduleMembers>
        </ScheduleItem>
        <ScheduleItem>
          <ScheduleTitle color="var(--black)">
            <IconSong color="var(--black)" />
            Song 109 – “Jehovah’s Warm Appeal: “Be Wise, My Son”
          </ScheduleTitle>
          <ScheduleMembers>
            <ScheduleMemberRow
              active
              type={t('tr_prayer') + ':'}
              name="Jeremiah Green"
            />
          </ScheduleMembers>
        </ScheduleItem>
      </ScheduleGrid>
    </Box>
  );
};

export default WeekendMeeting;
