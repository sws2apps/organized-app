import { Box } from '@mui/material';
import {
  IconClose,
  IconInfo,
  IconTalk,
  IconWatchtowerStudy,
} from '@components/icons';
import { AssignmentCode } from '@definition/assignment';
import { EditorContainer } from './index.styles';
import { Week } from '@definition/week_type';
import {
  DoubleFieldContainer,
  PrimaryFieldContainer,
  SecondaryFieldContainer,
} from '../shared_styles';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import usePublicTalkSelector from './public_talk_selector/usePublicTalkSelector';
import usePublicTalkTypeSelector from './public_talk_type_selector/usePublicTalkTypeSelector';
import useWeekendEditor from './useWeekendEditor';
import AssignmentsWeekDelete from '../assignments_week_delete';
import Button from '@components/button';
import Divider from '@components/divider';
import EventEditor from '../event_editor';
import MeetingSection from '../meeting_section';
import PersonSelector from '../person_selector';
import PublicTalkSelector from './public_talk_selector';
import PublicTalkTypeSelector from './public_talk_type_selector';
import SongSource from '../song_source';
import TalkTitleSolo from './talk_title_solo';
import Typography from '@components/typography';
import WeekTypeSelector from '../week_type_selector';
import Markup from '@components/text_markup';
import SongSelector from './song_selector';

const WeekendEditor = () => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const { isPublicTalkCoordinator, isWeekendEditor } = useCurrentUser();

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
    handleOpenVisitingSpeakers,
    clearAll,
    handleCloseClearAll,
    handleOpenClearAll,
    autoAssignOpeningPrayer,
    handleCloseSongSelector,
    songSelectorOpen,
  } = useWeekendEditor();

  const { talkType } = usePublicTalkTypeSelector(selectedWeek);

  const { selectedTalk } = usePublicTalkSelector(selectedWeek);

  return (
    <EditorContainer>
      {clearAll && (
        <AssignmentsWeekDelete
          open={clearAll}
          meeting="weekend"
          week={selectedWeek}
          onClose={handleCloseClearAll}
        />
      )}

      {songSelectorOpen && (
        <SongSelector onClose={handleCloseSongSelector} week={selectedWeek} />
      )}

      {weekDateLocale.length === 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconInfo color="var(--accent-400)" />
          <Typography color="var(--grey-400)">
            {t('tr_infoSecondPlanMidweekMeeting')}
          </Typography>
        </Box>
      )}

      {weekDateLocale.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <DoubleFieldContainer
            sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
          >
            <PrimaryFieldContainer>
              <Typography className="h2" sx={{ flex: 1 }}>
                {weekDateLocale}
              </Typography>
            </PrimaryFieldContainer>
            <SecondaryFieldContainer
              sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
            >
              <WeekTypeSelector week={selectedWeek} meeting="weekend" />
            </SecondaryFieldContainer>
          </DoubleFieldContainer>

          <Divider color="var(--accent-200)" />

          {showEventEditor && (
            <EventEditor meeting="weekend" week={selectedWeek} />
          )}

          {!showEventEditor && (
            <>
              <DoubleFieldContainer
                sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
              >
                <PrimaryFieldContainer>
                  {autoAssignOpeningPrayer && (
                    <SongSource
                      label={t('tr_openingSong')}
                      meeting="weekend"
                      type="opening"
                      week={selectedWeek}
                      isEdit={isWeekendEditor}
                    />
                  )}
                </PrimaryFieldContainer>
                <SecondaryFieldContainer
                  sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
                >
                  <PersonSelector
                    readOnly={!isWeekendEditor}
                    week={selectedWeek}
                    label={t('tr_chairman')}
                    type={AssignmentCode.WM_Chairman}
                    assignment="WM_Chairman"
                  />
                </SecondaryFieldContainer>
              </DoubleFieldContainer>

              {!autoAssignOpeningPrayer && (
                <DoubleFieldContainer
                  sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
                >
                  <PrimaryFieldContainer>
                    <SongSource
                      label={t('tr_openingSong')}
                      meeting="weekend"
                      type="opening"
                      week={selectedWeek}
                      isEdit={isWeekendEditor}
                    />
                  </PrimaryFieldContainer>
                  <SecondaryFieldContainer
                    sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
                  >
                    <PersonSelector
                      readOnly={!isWeekendEditor}
                      week={selectedWeek}
                      label={t('tr_prayer')}
                      type={AssignmentCode.WM_Prayer}
                      assignment="WM_OpeningPrayer"
                    />
                  </SecondaryFieldContainer>
                </DoubleFieldContainer>
              )}

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

                <DoubleFieldContainer
                  sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
                >
                  <PrimaryFieldContainer>
                    {weekType === Week.NORMAL && (
                      <PublicTalkSelector
                        week={selectedWeek}
                        showSpeakerCount={talkType === 'visitingSpeaker'}
                        type={talkType}
                        readOnly={!isPublicTalkCoordinator}
                      />
                    )}
                    {weekType !== Week.NORMAL && weekType !== Week.CO_VISIT && (
                      <TalkTitleSolo
                        type="public_talk"
                        week={selectedWeek}
                        readOnly={!isPublicTalkCoordinator}
                      />
                    )}
                    {weekType === Week.CO_VISIT && (
                      <TalkTitleSolo
                        type="co_public_talk"
                        week={selectedWeek}
                        readOnly={!isPublicTalkCoordinator}
                      />
                    )}
                  </PrimaryFieldContainer>

                  <SecondaryFieldContainer
                    sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
                  >
                    <PersonSelector
                      readOnly={!isPublicTalkCoordinator}
                      week={selectedWeek}
                      label={
                        showSpeaker2
                          ? t('tr_firstSpeaker')
                          : weekType === Week.CO_VISIT
                            ? t('tr_circuitOverseer')
                            : t('tr_speaker')
                      }
                      type={
                        weekType === Week.CO_VISIT
                          ? null
                          : AssignmentCode.WM_SpeakerSymposium
                      }
                      assignment={
                        weekType === Week.CO_VISIT
                          ? 'WM_CircuitOverseer'
                          : 'WM_Speaker_Part1'
                      }
                      jwStreamRecording={talkType === 'jwStreamRecording'}
                      visitingSpeaker={
                        weekType === Week.NORMAL &&
                        talkType === 'visitingSpeaker'
                      }
                      circuitOverseer={weekType === Week.CO_VISIT}
                      talk={selectedTalk?.talk_number}
                      helperNode={
                        weekType === Week.NORMAL &&
                        talkType === 'visitingSpeaker' && (
                          <Markup
                            content={t('tr_visitinSpeakerHelpText')}
                            className="label-small-regular"
                            color="var(--grey-350)"
                            anchorClassName="label-small-medium"
                            anchorClick={handleOpenVisitingSpeakers}
                            style={{ padding: '4px 16px 0 16px' }}
                          />
                        )
                      }
                    />

                    {showSpeaker2 && (
                      <PersonSelector
                        readOnly={!isPublicTalkCoordinator}
                        week={selectedWeek}
                        label={t('tr_secondSpeaker')}
                        type={AssignmentCode.WM_Speaker}
                        assignment="WM_Speaker_Part2"
                      />
                    )}
                  </SecondaryFieldContainer>
                </DoubleFieldContainer>
              </MeetingSection>

              <MeetingSection
                part={t('tr_watchtowerStudy')}
                color="var(--watchtower-study)"
                icon={<IconWatchtowerStudy color="var(--always-white)" />}
                expanded={openWTStudy}
                onToggle={handleToggleWTStudy}
              >
                <DoubleFieldContainer
                  sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
                >
                  <PrimaryFieldContainer>
                    <SongSource
                      meeting="weekend"
                      type="middle"
                      week={selectedWeek}
                    />
                  </PrimaryFieldContainer>
                  <SecondaryFieldContainer
                    sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
                  />
                </DoubleFieldContainer>

                <DoubleFieldContainer
                  sx={{
                    flexDirection: laptopUp ? 'row' : 'column',
                    margin: '8px 0',
                  }}
                >
                  <PrimaryFieldContainer
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <Typography className="label-small-regular">
                      {t('tr_studyArticle')}
                    </Typography>
                    <Typography className="h4">{wtStudyTitle}</Typography>
                  </PrimaryFieldContainer>
                  <SecondaryFieldContainer
                    sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
                  >
                    <PersonSelector
                      readOnly={!isWeekendEditor}
                      week={selectedWeek}
                      label={t('tr_conductor')}
                      type={AssignmentCode.WM_WTStudyConductor}
                      assignment="WM_WTStudy_Conductor"
                    />

                    {weekType !== Week.CO_VISIT && (
                      <PersonSelector
                        readOnly={!isWeekendEditor}
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
                <MeetingSection
                  part={t('tr_serviceTalk')}
                  color="var(--ministry)"
                  icon={<IconTalk color="var(--always-white)" />}
                  expanded={openServiceTalk}
                  onToggle={handleToggleServiceTalk}
                >
                  <DoubleFieldContainer
                    sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
                  >
                    <PrimaryFieldContainer>
                      <TalkTitleSolo
                        readOnly={!isWeekendEditor}
                        label={t('tr_serviceTalk')}
                        type="co_service_talk"
                        week={selectedWeek}
                      />
                    </PrimaryFieldContainer>
                    <SecondaryFieldContainer
                      sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
                    >
                      <PersonSelector
                        readOnly={!isWeekendEditor}
                        week={selectedWeek}
                        label={t('tr_circuitOverseer')}
                        assignment="WM_CircuitOverseer"
                        circuitOverseer={weekType === Week.CO_VISIT}
                      />
                    </SecondaryFieldContainer>
                  </DoubleFieldContainer>
                </MeetingSection>
              )}

              <Divider color="var(--accent-200)" />

              <DoubleFieldContainer
                sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
              >
                <PrimaryFieldContainer>
                  <SongSource
                    label={t('tr_closingSong')}
                    meeting="weekend"
                    type="concluding"
                    week={selectedWeek}
                    isEdit={isWeekendEditor && weekType === Week.CO_VISIT}
                  />
                </PrimaryFieldContainer>
                <SecondaryFieldContainer
                  sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
                >
                  <PersonSelector
                    readOnly={!isWeekendEditor}
                    week={selectedWeek}
                    label={t('tr_prayer')}
                    circuitOverseer={weekType === Week.CO_VISIT}
                    type={
                      weekType === Week.CO_VISIT
                        ? undefined
                        : AssignmentCode.WM_Prayer
                    }
                    assignment={
                      weekType === Week.CO_VISIT
                        ? 'WM_CircuitOverseer'
                        : 'WM_ClosingPrayer'
                    }
                  />
                </SecondaryFieldContainer>
              </DoubleFieldContainer>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="secondary"
                  color="red"
                  startIcon={<IconClose />}
                  onClick={handleOpenClearAll}
                >
                  {t('tr_clearAll')}
                </Button>
              </Box>
            </>
          )}
        </Box>
      )}
    </EditorContainer>
  );
};

export default WeekendEditor;
