import { Box } from '@mui/material';
import {
  IconClose,
  IconInfo,
  IconLivingPart,
  IconMinistryPart,
  IconNavigateLeft,
  IconNavigateRight,
  IconTreasuresPart,
} from '@components/icons';
import { AssignmentCode } from '@definition/assignment';
import { Week } from '@definition/week_type';
import {
  DoubleFieldContainer,
  PrimaryFieldContainer,
  SecondaryFieldContainer,
} from '../shared_styles';
import {
  ClassAssignmentContainer,
  PersonDoubleContainer,
  StyledNavigationArrowButton,
} from './index.styles';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useMidweekEditor from './useMidweekEditor';
import AssignmentsWeekDelete from '../assignments_week_delete';
import Button from '@components/button';
import ButtonGroup from '@components/button_group';
import COTalk from './co_talk';
import Divider from '@components/divider';
import EventEditor from '../event_editor';
import MeetingPart from '../meeting_part';
import MeetingSection from '../meeting_section';
import PartDuration from '../part_duration';
import PersonSelector from '../person_selector';
import SongSource from '../song_source';
import Tooltip from '@components/tooltip';
import Typography from '@components/typography';
import WeekHeader from './week_header';
import WeekTypeSelector from '../week_type_selector';
import Markup from '@components/text_markup';
import { setIsImportJWOrg } from '@services/recoil/sources';
import BrotherAssignment from './brother_assignment';
import LivingContainer from './living_container';
import MinistryContainer from './ministry_container';

const MidweekEditor = () => {
  const { t } = useAppTranslation();

  const { desktopUp, laptopUp, tablet500Down } = useBreakpoints();

  const {
    isEdit,
    weekDateLocale,
    selectedWeek,
    hasSource,
    showDoublePerson,
    weekType,
    handleToggleTGW,
    openTGW,
    handleToggleAYF,
    handleToggleLC,
    openAYF,
    openLC,
    handleEditAssignments,
    handleEditParts,
    clearAll,
    handleCloseClearAll,
    handleOpenClearAll,
    closingPrayerAuto,
    openingPrayerAuto,
    sourceLocale,
    handleChangeWeekBack,
    handleChangeWeekNext,
    showWeekArrows,
  } = useMidweekEditor();

  return (
    <Box
      sx={{
        borderRadius: 'var(--radius-xl)',
        padding: '16px',
        backgroundColor: 'var(--white)',
        border: '1px solid var(--accent-300)',
        flexGrow: 1,
      }}
    >
      {clearAll && (
        <AssignmentsWeekDelete
          open={clearAll}
          meeting="midweek"
          week={selectedWeek}
          onClose={handleCloseClearAll}
        />
      )}

      {weekDateLocale.length === 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconInfo color="var(--accent-400)" />
          <Typography color="var(--grey-400)">
            {t('tr_infoPlanMidweekMeeting')}
          </Typography>
        </Box>
      )}

      {weekDateLocale.length > 0 && (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '16px',
              justifyContent: tablet500Down && 'space-between',
            }}
          >
            <StyledNavigationArrowButton
              onClick={showWeekArrows.back ? handleChangeWeekBack : undefined}
              sx={{
                cursor: showWeekArrows.back && 'pointer',
              }}
            >
              <IconNavigateLeft
                color={showWeekArrows.back ? 'var(--black)' : 'var(--grey-300)'}
              />
            </StyledNavigationArrowButton>

            <Typography
              className="h2"
              sx={{
                minWidth: !tablet500Down && '140px',
                textAlign: 'center',
              }}
            >
              {weekDateLocale}
            </Typography>
            <StyledNavigationArrowButton
              onClick={showWeekArrows.next ? handleChangeWeekNext : undefined}
              sx={{
                cursor: showWeekArrows.next && 'pointer',
              }}
            >
              <IconNavigateRight
                color={showWeekArrows.next ? 'var(--black)' : 'var(--grey-300)'}
              />
            </StyledNavigationArrowButton>
          </Box>

          <DoubleFieldContainer
            sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
          >
            <PrimaryFieldContainer
              sx={{ alignSelf: laptopUp ? 'center' : 'flex-start' }}
            >
              <ButtonGroup
                buttons={[
                  {
                    children: t('tr_editAssignments'),
                    onClick: handleEditAssignments,
                    className: isEdit ? '' : 'active',
                  },
                  {
                    children: t('tr_editParts'),
                    onClick: handleEditParts,
                    className: isEdit ? 'active' : '',
                  },
                ]}
              />
            </PrimaryFieldContainer>
            <SecondaryFieldContainer
              sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
            >
              <WeekTypeSelector week={selectedWeek} meeting="midweek" />
            </SecondaryFieldContainer>
          </DoubleFieldContainer>

          <Divider color="var(--accent-200)" />

          {!hasSource && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconInfo color="var(--accent-400)" />
              <Markup
                content={t('tr_meetingMaterialsNotAvailable')}
                className="body-regular"
                anchorClick={() => setIsImportJWOrg(true)}
                anchorClassName="h4"
                color="var(--grey-400)"
              />
            </Box>
          )}

          {hasSource && (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {weekType !== Week.NORMAL && weekType !== Week.CO_VISIT && (
                <EventEditor meeting="midweek" week={selectedWeek} />
              )}

              {(weekType === Week.NORMAL || weekType === Week.CO_VISIT) && (
                <>
                  <DoubleFieldContainer
                    sx={{
                      flexDirection: laptopUp ? 'row' : 'column',
                      alignItems:
                        desktopUp && !showDoublePerson
                          ? 'center'
                          : 'flex-start',
                    }}
                  >
                    <PrimaryFieldContainer>
                      <WeekHeader week={selectedWeek} />
                    </PrimaryFieldContainer>
                    <SecondaryFieldContainer
                      sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
                    >
                      <Tooltip
                        title={t('tr_notEditableInEditPartsMode')}
                        show={isEdit}
                        followCursor
                      >
                        <PersonSelector
                          week={selectedWeek}
                          label={t('tr_chairman')}
                          type={AssignmentCode.MM_Chairman}
                          assignment="MM_Chairman_A"
                          readOnly={isEdit}
                        />
                      </Tooltip>
                      {showDoublePerson && (
                        <Tooltip
                          title={t('tr_notEditableInEditPartsMode')}
                          show={isEdit}
                          followCursor
                        >
                          <PersonSelector
                            week={selectedWeek}
                            label={t('tr_auxClassCounselor')}
                            type={AssignmentCode.MM_AuxiliaryCounselor}
                            assignment="MM_Chairman_B"
                            readOnly={isEdit}
                          />
                        </Tooltip>
                      )}
                    </SecondaryFieldContainer>
                  </DoubleFieldContainer>

                  <Divider color="var(--accent-200)" />

                  <DoubleFieldContainer
                    sx={{
                      flexDirection: laptopUp ? 'row' : 'column',
                      alignItems: desktopUp ? 'center' : 'flex-start',
                    }}
                  >
                    <PrimaryFieldContainer>
                      <SongSource
                        week={selectedWeek}
                        meeting="midweek"
                        type="opening"
                      />
                    </PrimaryFieldContainer>
                    <SecondaryFieldContainer
                      sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
                    >
                      {!openingPrayerAuto && (
                        <Tooltip
                          title={t('tr_notEditableInEditPartsMode')}
                          show={isEdit}
                          followCursor
                        >
                          <PersonSelector
                            week={selectedWeek}
                            label={t('tr_prayer')}
                            type={AssignmentCode.MM_Prayer}
                            assignment="MM_OpeningPrayer"
                            readOnly={isEdit}
                          />
                        </Tooltip>
                      )}
                    </SecondaryFieldContainer>
                  </DoubleFieldContainer>

                  <MeetingSection
                    part={t('tr_treasuresPart', { lng: sourceLocale })}
                    color="var(--treasures-from-gods-word)"
                    icon={<IconTreasuresPart color="var(--always-white)" />}
                    expanded={openTGW}
                    onToggle={handleToggleTGW}
                  >
                    {/* tgw_talk */}
                    <BrotherAssignment
                      isEdit={isEdit}
                      durationEditable={true}
                      selectedWeek={selectedWeek}
                      type="tgw_talk"
                    />

                    <Divider color="var(--accent-200)" />

                    {/* tgw_gems */}
                    <BrotherAssignment
                      isEdit={isEdit}
                      durationEditable={true}
                      selectedWeek={selectedWeek}
                      type="tgw_gems"
                    />

                    <Divider color="var(--accent-200)" />

                    {/* tgw_bible_reading */}
                    <DoubleFieldContainer
                      sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
                    >
                      <PrimaryFieldContainer>
                        <MeetingPart
                          week={selectedWeek}
                          type="tgw_bible_reading"
                          color="var(--treasures-from-gods-word)"
                        />
                      </PrimaryFieldContainer>
                      <SecondaryFieldContainer
                        sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
                      >
                        <ClassAssignmentContainer>
                          {showDoublePerson && (
                            <Typography
                              className="body-small-semibold"
                              color="var(--grey-350)"
                            >
                              {t('tr_mainHall')}
                            </Typography>
                          )}
                          <Tooltip
                            title={t('tr_notEditableInEditPartsMode')}
                            show={isEdit}
                            followCursor
                          >
                            <PersonSelector
                              week={selectedWeek}
                              label={t('tr_student')}
                              type={AssignmentCode.MM_BibleReading}
                              assignment="MM_TGWBibleReading_A"
                              readOnly={isEdit}
                            />
                          </Tooltip>
                        </ClassAssignmentContainer>

                        {showDoublePerson && (
                          <ClassAssignmentContainer>
                            <Typography
                              className="body-small-semibold"
                              color="var(--grey-350)"
                            >
                              {t('tr_auxClass')}
                            </Typography>

                            <Tooltip
                              title={t('tr_notEditableInEditPartsMode')}
                              show={isEdit}
                              followCursor
                            >
                              <PersonSelector
                                week={selectedWeek}
                                label={t('tr_student')}
                                type={AssignmentCode.MM_BibleReading}
                                assignment="MM_TGWBibleReading_B"
                                readOnly={isEdit}
                              />
                            </Tooltip>
                          </ClassAssignmentContainer>
                        )}
                      </SecondaryFieldContainer>
                    </DoubleFieldContainer>
                  </MeetingSection>

                  <MeetingSection
                    part={t('tr_applyFieldMinistryPart', { lng: sourceLocale })}
                    color="var(--apply-yourself-to-the-field-ministry)"
                    icon={<IconMinistryPart color="var(--always-white)" />}
                    expanded={openAYF}
                    onToggle={handleToggleAYF}
                  >
                    <MinistryContainer
                      isEdit={isEdit}
                      selectedWeek={selectedWeek}
                    />
                  </MeetingSection>

                  <MeetingSection
                    part={t('tr_livingPart', { lng: sourceLocale })}
                    color="var(--living-as-christians)"
                    icon={<IconLivingPart color="var(--always-white)" />}
                    expanded={openLC}
                    onToggle={handleToggleLC}
                  >
                    <DoubleFieldContainer
                      sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
                    >
                      <PrimaryFieldContainer>
                        <SongSource
                          week={selectedWeek}
                          meeting="midweek"
                          type="middle"
                        />
                      </PrimaryFieldContainer>
                      <SecondaryFieldContainer
                        sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
                      />
                    </DoubleFieldContainer>

                    <Divider color="var(--accent-200)" />

                    <LivingContainer
                      isEdit={isEdit}
                      selectedWeek={selectedWeek}
                    />

                    <Divider color="var(--accent-200)" />

                    {/* lc_cbs */}
                    {weekType !== Week.CO_VISIT && (
                      <DoubleFieldContainer
                        sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
                      >
                        <PrimaryFieldContainer
                          sx={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            flexWrap: 'wrap',
                          }}
                        >
                          {isEdit && (
                            <PartDuration
                              length={30}
                              week={selectedWeek}
                              type="lc_cbs"
                            />
                          )}

                          <MeetingPart
                            week={selectedWeek}
                            type="lc_cbs"
                            color="var(--living-as-christians)"
                            isEdit={isEdit}
                            isOverwrite={isEdit}
                          />
                        </PrimaryFieldContainer>
                        <SecondaryFieldContainer
                          sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
                        >
                          <PersonDoubleContainer>
                            <Tooltip
                              title={t('tr_notEditableInEditPartsMode')}
                              show={isEdit}
                              followCursor
                            >
                              <PersonSelector
                                week={selectedWeek}
                                label={t('tr_cbsConductor')}
                                type={AssignmentCode.MM_CBSConductor}
                                assignment="MM_LCCBSConductor"
                                readOnly={isEdit}
                              />
                            </Tooltip>
                            <Tooltip
                              title={t('tr_notEditableInEditPartsMode')}
                              show={isEdit}
                              followCursor
                            >
                              <PersonSelector
                                week={selectedWeek}
                                label={t('tr_cbsReader')}
                                type={AssignmentCode.MM_CBSReader}
                                assignment="MM_LCCBSReader"
                                readOnly={isEdit}
                              />
                            </Tooltip>
                          </PersonDoubleContainer>
                        </SecondaryFieldContainer>
                      </DoubleFieldContainer>
                    )}

                    {/* CO talk */}
                    {weekType === Week.CO_VISIT && (
                      <COTalk week={selectedWeek} meeting="midweek" />
                    )}

                    <Divider color="var(--accent-200)" />
                  </MeetingSection>

                  {/* closing_prayer */}
                  <DoubleFieldContainer
                    sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
                  >
                    <PrimaryFieldContainer>
                      <SongSource
                        week={selectedWeek}
                        meeting="midweek"
                        type="concluding"
                        isEdit={isEdit || weekType === Week.CO_VISIT}
                      />
                    </PrimaryFieldContainer>
                    <SecondaryFieldContainer
                      sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
                    >
                      {!closingPrayerAuto && (
                        <Tooltip
                          title={t('tr_notEditableInEditPartsMode')}
                          show={isEdit}
                          followCursor
                        >
                          <PersonSelector
                            week={selectedWeek}
                            label={t('tr_prayer')}
                            type={AssignmentCode.MM_Prayer}
                            assignment="MM_ClosingPrayer"
                            readOnly={isEdit}
                          />
                        </Tooltip>
                      )}
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
        </Box>
      )}
    </Box>
  );
};

export default MidweekEditor;
