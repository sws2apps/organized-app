import { Box } from '@mui/material';
import {
  IconDate,
  IconDiamond,
  IconLivingPart,
  IconMinistry,
  IconSong,
  IconWavingHand,
} from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import {
  ScheduleDescription,
  ScheduleGrid,
  ScheduleHeader,
  ScheduleItem,
  ScheduleItemTitle,
  ScheduleMemberClassRoom,
  ScheduleMemberRow,
  ScheduleMembers,
  ScheduleTitle,
  ScheduleWeekTitle,
} from '../shared_components';
import { MidweekMeetingProps } from './index.types';
import Badge from '@components/badge';
import Typography from '@components/typography';
import {
  DoubleFieldContainer,
  PrimaryFieldContainer,
  SecondaryFieldContainer,
} from '../shared_styles';
import WeekHeader from '@features/meetings/midweek_editor/week_header';

const MidweekMeeting = ({
  week,
  currentVisible,
  onCurrent,
}: MidweekMeetingProps) => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  return (
    <Box sx={{ marginTop: '-16px' }}>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '40px',
          marginBottom: '16px',
        }}
      >
        {!currentVisible && (
          <Box
            onClick={onCurrent}
            sx={{
              borderRadius: 'var(--radius-max)',
              backgroundColor: 'var(--accent-150)',
              display: 'flex',
              gap: '4px',
              alignItems: 'center',
              padding: '4px 8px',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <IconDate width={22} height={22} color="var(--accent-dark)" />
            <Typography
              className="body-small-semibold"
              color="var(--accent-dark)"
            >
              {t('tr_toCurrentWeek')}
            </Typography>
          </Box>
        )}

        <Badge
          text={`${t('tr_lastUpdated')} Aug 22, 2024`}
          color="grey"
          size="small"
          filled={false}
          sx={{ position: 'absolute', left: 0 }}
        />
      </Box>

      {week && (
        <Box>
          <DoubleFieldContainer laptopUp={laptopUp}>
            <PrimaryFieldContainer>
              <WeekHeader week={week} />
            </PrimaryFieldContainer>
            <SecondaryFieldContainer
              laptopUp={laptopUp}
            ></SecondaryFieldContainer>
          </DoubleFieldContainer>
        </Box>
      )}

      {/* <ScheduleGrid>
        <ScheduleItemTitle>
          <ScheduleWeekTitle color="var(--black)">
            <Box>
              8 November 2023 |{' '}
              <Box
                sx={{
                  display: 'inline-block',
                }}
              >
                2 Corinthians 4-6
              </Box>
            </Box>
            <Badge
              text={t('tr_circuitOverseerWeek')}
              color="accent"
              size="medium"
              multiLine
              filled={false}
              icon={<IconWavingHand />}
            />
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
          text={t('tr_treasuresPart')}
          color="var(--treasures-from-gods-word)"
          icon={<IconDiamond />}
        />
        <ScheduleItem>
          <Box>
            <ScheduleTitle color="var(--black)">
              <IconSong color="var(--black)" />
              Song 109 – “Jehovah’s Warm Appeal: “Be Wise, My Son”
            </ScheduleTitle>
          </Box>
        </ScheduleItem>
        <ScheduleItem>
          <ScheduleTitle
            cssCounter
            color="var(--text-treasures-from-gods-word)"
          >
            “God’s Loyal Love Protects Us From Satan’s Lies”
          </ScheduleTitle>
          <ScheduleMembers>
            <ScheduleMemberRow name="Jeremiah Green" />
          </ScheduleMembers>
        </ScheduleItem>
        <ScheduleItem>
          <ScheduleTitle
            cssCounter
            color="var(--text-treasures-from-gods-word)"
          >
            {t('tr_tgwGems')}
          </ScheduleTitle>
          <ScheduleMembers>
            <ScheduleMemberRow name="Jeremiah Green" />
          </ScheduleMembers>
        </ScheduleItem>
        <ScheduleItem>
          <Box>
            <ScheduleTitle
              cssCounter
              color="var(--text-treasures-from-gods-word)"
            >
              {t('tr_bibleReading')}
            </ScheduleTitle>
            <ScheduleDescription>
              (3 Min.) Job 9:20-35 (th study 11)
            </ScheduleDescription>
          </Box>
          <ScheduleMembers>
            <ScheduleMemberRow
              type={t('tr_student') + ':'}
              name="Jeremiah Green"
            />
          </ScheduleMembers>
        </ScheduleItem>
        <ScheduleHeader
          text={t('tr_applyFieldMinistryPart')}
          color="var(--apply-yourself-to-the-field-ministry)"
          icon={<IconMinistry />}
        />
        <ScheduleItem>
          <Box>
            <ScheduleTitle
              cssCounter
              color="var(--text-apply-yourself-to-the-field-ministry)"
            >
              {t('tr_initialCall')}
            </ScheduleTitle>
            <ScheduleDescription>
              (3 Min.) Begin with the sample conversation topic. Offer a
              publication from the Teaching Toolbox. (th study 17)
            </ScheduleDescription>
          </Box>
          <ScheduleMembers>
            <ScheduleMemberClassRoom classRoomName={t('tr_mainHall')}>
              <ScheduleMemberRow
                female
                type={t('tr_student') + ':'}
                name="Jeremiah Green"
              />
              <ScheduleMemberRow
                female
                type={t('tr_assistantS89')}
                name="Jeremiah Green"
              />
            </ScheduleMemberClassRoom>
            <ScheduleMemberClassRoom classRoomName={t('tr_auxClassroom')}>
              <ScheduleMemberRow
                female
                type={t('tr_student') + ':'}
                name="Jeremiah Green"
              />
              <ScheduleMemberRow
                female
                type={t('tr_assistantS89')}
                name="Jeremiah Green"
              />
            </ScheduleMemberClassRoom>
          </ScheduleMembers>
        </ScheduleItem>
        <ScheduleHeader
          text={t('tr_livingPart')}
          color="var(--living-as-christians)"
          icon={<IconLivingPart />}
        />
        <ScheduleItem>
          <Box>
            <ScheduleTitle cssCounter color="var(--text_living-as-christians)">
              “Help Nonreligious People Come to Know Their Creator”
            </ScheduleTitle>
            <ScheduleDescription>
              (3 Min.) Job 9:20-35 (th study 11)
            </ScheduleDescription>
          </Box>
          <ScheduleMembers>
            <ScheduleMemberRow
              type={t('tr_student') + ':'}
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
      </ScheduleGrid> */}
    </Box>
  );
};

export default MidweekMeeting;
