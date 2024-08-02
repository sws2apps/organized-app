import { Box } from '@mui/material';
import { IconInfo, IconTalk, IconWatchtowerStudy } from '@components/icons';
import { AssignmentCode } from '@definition/assignment';
import {
  DoubleFieldContainer,
  EditorContainer,
  PrimaryFieldContainer,
  SecondaryFieldContainer,
} from './index.styles';
import { Week } from '@definition/week_type';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import usePublicTalkTypeSelector from './public_talk_type_selector/usePublicTalkTypeSelector';
import useWeekendEditor from './useWeekendEditor';
import Divider from '@components/divider';
import EventEditor from '../event_editor';
import MeetingSection from '../meeting_section';
import PersonSelector from '../person_selector';
import PublicTalkSelector from '../public_talk_selector';
import PublicTalkTypeSelector from './public_talk_type_selector';
import SongSource from '../song_source';
import TalkTitleSolo from './talk_title_solo';
import Typography from '@components/typography';
import WeekTypeSelector from '../week_type_selector';

const WeekendEditor = () => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const {
    weekDateLocale,
    selectedWeek,
    weekType,
    wtStudyTitle,
    showEventEditor,
    handleTogglePulicTalk,
    openPublicTalk,
    handleToggleWTStudy,
    openWTStudy,
    handleToggleServiceTalk,
    openServiceTalk,
    showSpeaker2,
  } = useWeekendEditor();

  const { talkType } = usePublicTalkTypeSelector(selectedWeek);

  return (
    <EditorContainer>
      {weekDateLocale.length === 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconInfo color="var(--accent-400)" />
          <Typography color="var(--grey-400)">
            {t('tr_infoPlanMidweekMeeting')}
          </Typography>
        </Box>
      )}

      {weekDateLocale.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Box
            sx={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              flexDirection: laptopUp ? 'row' : 'column',
            }}
          >
            <Typography className="h2" sx={{ flex: 1 }}>
              {weekDateLocale}
            </Typography>
            <WeekTypeSelector week={selectedWeek} meeting="weekend" />
          </Box>

          <Divider color="var(--accent-200)" />

          {showEventEditor && (
            <EventEditor meeting="weekend" week={selectedWeek} />
          )}

          {!showEventEditor && (
            <>
              <DoubleFieldContainer laptopUp={laptopUp}>
                <PrimaryFieldContainer>
                  <PersonSelector
                    week={selectedWeek}
                    label={t('tr_chairman')}
                    type={AssignmentCode.WM_Chairman}
                    assignment="WM_Chairman"
                  />
                </PrimaryFieldContainer>
                <SecondaryFieldContainer laptopUp={laptopUp}>
                  <PersonSelector
                    week={selectedWeek}
                    label={t('tr_prayer')}
                    type={AssignmentCode.WM_Prayer}
                    assignment="WM_OpeningPrayer"
                  />
                </SecondaryFieldContainer>
              </DoubleFieldContainer>

              <Divider color="var(--accent-200)" />

              <MeetingSection
                part={t('tr_publicTalk')}
                color="var(--weekend-meeting)"
                icon={<IconTalk color="var(--always-white)" />}
                expanded={openPublicTalk}
                onToggle={handleTogglePulicTalk}
              >
                {weekType !== Week.CO_VISIT && (
                  <PublicTalkTypeSelector week={selectedWeek} />
                )}

                <DoubleFieldContainer laptopUp={laptopUp}>
                  <PrimaryFieldContainer>
                    <SongSource
                      label={t('tr_openingSong')}
                      meeting="weekend"
                      type="opening"
                      week={selectedWeek}
                      isEdit={true}
                    />
                  </PrimaryFieldContainer>
                  <SecondaryFieldContainer laptopUp={laptopUp} />
                </DoubleFieldContainer>

                <DoubleFieldContainer
                  laptopUp={laptopUp}
                  sx={{
                    alignItems: laptopUp
                      ? showSpeaker2
                        ? 'flex-start'
                        : 'center'
                      : 'unset',
                  }}
                >
                  <PrimaryFieldContainer>
                    {weekType === Week.NORMAL && (
                      <PublicTalkSelector week={selectedWeek} />
                    )}
                    {weekType !== Week.NORMAL && weekType !== Week.CO_VISIT && (
                      <TalkTitleSolo type="public_talk" week={selectedWeek} />
                    )}
                    {weekType === Week.CO_VISIT && (
                      <TalkTitleSolo
                        type="co_public_talk"
                        week={selectedWeek}
                      />
                    )}
                  </PrimaryFieldContainer>

                  {weekType !== Week.CO_VISIT &&
                    talkType !== 'jwStreamRecording' && (
                      <SecondaryFieldContainer laptopUp={laptopUp}>
                        <PersonSelector
                          week={selectedWeek}
                          label={t('tr_speaker')}
                          type={AssignmentCode.WM_SpeakerSymposium}
                          assignment="WM_Speaker_Part1"
                          visitingSpeaker={talkType === 'visitingSpeaker'}
                        />

                        {showSpeaker2 && (
                          <PersonSelector
                            week={selectedWeek}
                            label={t('tr_speaker')}
                            type={AssignmentCode.WM_Speaker}
                            assignment="WM_Speaker_Part2"
                          />
                        )}
                      </SecondaryFieldContainer>
                    )}
                </DoubleFieldContainer>
              </MeetingSection>

              <Divider color="var(--accent-200)" />

              <MeetingSection
                part={t('tr_watchtowerStudy')}
                color="var(--watchtower-study)"
                icon={<IconWatchtowerStudy color="var(--always-white)" />}
                expanded={openWTStudy}
                onToggle={handleToggleWTStudy}
              >
                <DoubleFieldContainer laptopUp={laptopUp}>
                  <PrimaryFieldContainer>
                    <SongSource
                      meeting="weekend"
                      type="middle"
                      week={selectedWeek}
                    />
                  </PrimaryFieldContainer>
                  <SecondaryFieldContainer laptopUp={laptopUp} />
                </DoubleFieldContainer>

                <DoubleFieldContainer
                  laptopUp={laptopUp}
                  sx={{
                    alignItems: laptopUp
                      ? weekType !== Week.CO_VISIT
                        ? 'flex-start'
                        : 'center'
                      : 'unset',
                    margin: '8px 0',
                  }}
                >
                  <PrimaryFieldContainer>
                    <Typography className="h4">{wtStudyTitle}</Typography>
                  </PrimaryFieldContainer>
                  <SecondaryFieldContainer laptopUp={laptopUp}>
                    <PersonSelector
                      week={selectedWeek}
                      label={t('tr_conductor')}
                      type={AssignmentCode.WM_WTStudyConductor}
                      assignment="WM_WTStudy_Conductor"
                    />

                    {weekType !== Week.CO_VISIT && (
                      <PersonSelector
                        week={selectedWeek}
                        label={t('tr_reader')}
                        type={AssignmentCode.WM_WTStudyReader}
                        assignment="WM_WTStudy_Reader"
                      />
                    )}
                  </SecondaryFieldContainer>
                </DoubleFieldContainer>
              </MeetingSection>

              {weekType === Week.CO_VISIT && (
                <>
                  <Divider color="var(--accent-200)" />

                  <MeetingSection
                    part={t('tr_serviceTalk')}
                    color="var(--weekend-meeting)"
                    icon={<IconTalk color="var(--always-white)" />}
                    expanded={openServiceTalk}
                    onToggle={handleToggleServiceTalk}
                  >
                    <DoubleFieldContainer laptopUp={laptopUp}>
                      <PrimaryFieldContainer>
                        <TalkTitleSolo
                          label={t('tr_serviceTalk')}
                          type="co_service_talk"
                          week={selectedWeek}
                        />
                      </PrimaryFieldContainer>
                    </DoubleFieldContainer>
                  </MeetingSection>
                </>
              )}

              {weekType === Week.CO_VISIT && (
                <Divider color="var(--accent-200)" />
              )}

              <DoubleFieldContainer laptopUp={laptopUp}>
                <PrimaryFieldContainer>
                  <SongSource
                    label={t('tr_closingSong')}
                    meeting="weekend"
                    type="concluding"
                    week={selectedWeek}
                    isEdit={weekType === Week.CO_VISIT}
                  />
                </PrimaryFieldContainer>
                <SecondaryFieldContainer laptopUp={laptopUp}>
                  <PersonSelector
                    week={selectedWeek}
                    label={t('tr_prayer')}
                    type={AssignmentCode.WM_Prayer}
                    assignment="WM_ClosingPrayer"
                  />
                </SecondaryFieldContainer>
              </DoubleFieldContainer>
            </>
          )}
        </Box>
      )}
    </EditorContainer>
  );
};

export default WeekendEditor;
