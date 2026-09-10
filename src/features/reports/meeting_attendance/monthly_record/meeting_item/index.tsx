import { Box, Stack } from '@mui/material';
import { IconLanguageGroup } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { MeetingItemProps } from './index.types';
import useMeetingItem from './useMeetingItem';
import AttendanceSummary from '../attendance_summary';
import Divider from '@components/divider';
import Typography from '@components/typography';
import WeekBox from '../week_box';

const MeetingItem = (props: MeetingItemProps) => {
  const { t } = useAppTranslation();

  const { tablet600Up } = useBreakpoints();

  const { month, type } = props;

  const { weeksCount, groups } = useMeetingItem(props);

  return (
    <Stack spacing="16px">
      <Box
        sx={{
          borderRadius: 'var(--radius-s)',
          padding: '4px 8px',
          backgroundColor:
            type === 'midweek'
              ? 'var(--midweek-meeting)'
              : 'var(--weekend-meeting)',
        }}
      >
        <Typography className="h3" color="var(--always-white)">
          {type === 'midweek' ? t('tr_midweekMeeting') : t('tr_weekendMeeting')}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: tablet600Up
            ? `repeat(${weeksCount.length}, 1fr)`
            : 'repeat(2, 1fr)',
          ...(!tablet600Up && {
            '& > :last-child:nth-of-type(odd)': {
              gridColumn: '1 / -1',
            },
          }),
        }}
      >
        {weeksCount.map((week) => (
          <WeekBox
            key={`present-${week.toString()}`}
            index={week}
            month={month}
            type={type}
          />
        ))}
      </Box>

      {groups.length > 0 && (
        <>
          <Divider color="var(--accent-200)" />

          <Stack
            spacing="18px"
            marginTop="8px !important"
            divider={<Divider color="var(--accent-200)" />}
          >
            {groups.map((group) => (
              <Stack key={group.id} spacing="16px">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <IconLanguageGroup color="var(--black)" />
                  <Typography className="body-small-semibold">
                    {group.name}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gap: '16px',
                    gridTemplateColumns: tablet600Up
                      ? `repeat(${weeksCount.length}, 1fr)`
                      : 'repeat(2, 1fr)',
                    ...(!tablet600Up && {
                      '& > :last-child:nth-of-type(odd)': {
                        gridColumn: '1 / -1',
                      },
                    }),
                  }}
                >
                  {weeksCount.map((week) => (
                    <WeekBox
                      key={`language-group-${week.toString()}`}
                      index={week}
                      month={month}
                      type={type}
                      view={group.id}
                    />
                  ))}
                </Box>
              </Stack>
            ))}
          </Stack>
        </>
      )}

      <Stack spacing="16px" direction={tablet600Up ? 'row' : 'column'}>
        <AttendanceSummary month={month} type={type} summary="total" />
        <AttendanceSummary month={month} type={type} summary="average" />
      </Stack>
    </Stack>
  );
};

export default MeetingItem;
