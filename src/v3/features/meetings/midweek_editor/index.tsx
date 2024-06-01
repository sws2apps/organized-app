import { Box } from '@mui/material';
import { IconInfo, IconLivingPart, IconMinistryPart, IconTreasuresPart } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useMidweekEditor from './useMidweekEditor';
import Divider from '@components/divider';
import MeetingPart from '../meeting_part';
import MeetingSection from '../meeting_section';
import SongSource from '../song_source';
import SwitchCheckbox from '../switch_checkbox';
import Typography from '@components/typography';
import WeekHeader from './week_header';
import WeekTypeSelector from '../week_type_selector';

const MidweekEditor = () => {
  const { t } = useAppTranslation();

  const { weekDateLocale, selectedWeek, hasSource, ayfCount, lcCount } = useMidweekEditor();

  return (
    <Box
      sx={{
        borderRadius: 'var(--radius-xl)',
        padding: '16px',
        backgroundColor: 'var(--white)',
        border: '1px solid var(--accent-300)',
        width: '100%',
      }}
    >
      {weekDateLocale.length === 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconInfo color="var(--accent-400)" />
          <Typography color="var(--grey-400)">{t('tr_infoPlanMidweekMeeting')}</Typography>
        </Box>
      )}
      {weekDateLocale.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Typography className="h2">{weekDateLocale}</Typography>

          <Box
            sx={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <WeekTypeSelector week={selectedWeek} />
            <SwitchCheckbox week={selectedWeek} meeting="midweek" />
          </Box>

          <Divider color="var(--accent-200)" />

          {!hasSource && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconInfo color="var(--accent-400)" />
              <Typography color="var(--grey-400)">{t('tr_meetingMaterialsNotAvailable')}</Typography>
            </Box>
          )}

          {hasSource && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <WeekHeader week={selectedWeek} />

              <Divider color="var(--accent-200)" />

              <SongSource week={selectedWeek} meeting="midweek" type="opening" />

              <Divider color="var(--accent-200)" />

              <MeetingSection
                part={t('tr_treasuresPart')}
                color="var(--treasures-from-gods-word)"
                icon={<IconTreasuresPart color="var(--always-white)" />}
              />

              <MeetingPart week={selectedWeek} type="tgw_talk" color="var(--treasures-from-gods-word)" />

              <Divider color="var(--accent-200)" />

              <MeetingPart week={selectedWeek} type="tgw_gems" color="var(--treasures-from-gods-word)" />

              <Divider color="var(--accent-200)" />

              <MeetingPart week={selectedWeek} type="tgw_bible_reading" color="var(--treasures-from-gods-word)" />

              <MeetingSection
                part={t('tr_applyFieldMinistryPart')}
                color="var(--apply-yourself-to-the-field-ministry)"
                icon={<IconMinistryPart color="var(--always-white)" />}
              />

              <MeetingPart week={selectedWeek} type="ayf_part1" color="var(--apply-yourself-to-the-field-ministry)" />

              {ayfCount > 1 && (
                <>
                  <Divider color="var(--accent-200)" />

                  <MeetingPart
                    week={selectedWeek}
                    type="ayf_part2"
                    color="var(--apply-yourself-to-the-field-ministry)"
                  />
                </>
              )}

              {ayfCount > 2 && (
                <>
                  <Divider color="var(--accent-200)" />

                  <MeetingPart
                    week={selectedWeek}
                    type="ayf_part3"
                    color="var(--apply-yourself-to-the-field-ministry)"
                  />
                </>
              )}

              {ayfCount > 3 && (
                <>
                  <Divider color="var(--accent-200)" />

                  <MeetingPart
                    week={selectedWeek}
                    type="ayf_part4"
                    color="var(--apply-yourself-to-the-field-ministry)"
                  />
                </>
              )}

              <MeetingSection
                part={t('tr_livingPart')}
                color="var(--living-as-christians)"
                icon={<IconLivingPart color="var(--always-white)" />}
              />

              <SongSource week={selectedWeek} meeting="midweek" type="middle" />

              <Divider color="var(--accent-200)" />

              <MeetingPart week={selectedWeek} type="lc_part1" color="var(--living-as-christians)" />

              {lcCount > 1 && (
                <>
                  <Divider color="var(--accent-200)" />

                  <MeetingPart week={selectedWeek} type="lc_part2" color="var(--living-as-christians)" />
                </>
              )}

              {lcCount > 2 && (
                <>
                  <Divider color="var(--accent-200)" />

                  <MeetingPart week={selectedWeek} type="lc_part3" color="var(--living-as-christians)" />
                </>
              )}

              <Divider color="var(--accent-200)" />

              <MeetingPart week={selectedWeek} type="lc_cbs" color="var(--living-as-christians)" />

              <Divider color="var(--accent-200)" />

              <SongSource week={selectedWeek} meeting="midweek" type="concluding" />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default MidweekEditor;
