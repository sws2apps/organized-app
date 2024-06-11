import { Box } from '@mui/material';
import {
  IconCustom,
  IconEdit,
  IconInfo,
  IconLivingPart,
  IconMinistryPart,
  IconSave,
  IconTreasuresPart,
} from '@components/icons';
import { AssignmentCode } from '@definition/assignment';
import { Week } from '@definition/week_type';
import { ClassAssignmentContainer, PersonDoubleContainer, PersonSelectorContainer, RowContainer } from './index.styles';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useMidweekEditor from './useMidweekEditor';
import Button from '@components/button';
import Checkbox from '@components/checkbox';
import Divider from '@components/divider';
import MeetingPart from '../meeting_part';
import MeetingSection from '../meeting_section';
import PartDuration from '../part_duration';
import PersonSelector from '../person_selector';
import SongSource from '../song_source';
import SwitchCheckbox from '../switch_checkbox';
import Typography from '@components/typography';
import WeekHeader from './week_header';
import WeekTypeSelector from '../week_type_selector';

const MidweekEditor = () => {
  const { t } = useAppTranslation();

  const { desktopUp, laptopUp } = useBreakpoints();

  const {
    handleToggleMode,
    isEdit,
    weekDateLocale,
    selectedWeek,
    hasSource,
    ayfCount,
    lcCount,
    showDoublePerson,
    ayfPart1,
    showAYFPart1Assistant,
    ayfPart2,
    showAYFPart2Assistant,
    ayfPart3,
    showAYFPart3Assistant,
    ayfPart4,
    showAYFPart4Assistant,
    lcNoAssignPart1,
    lcNoAssignPart2,
    lcNoAssignPart3,
    weekType,
    customPartEnabled,
    handleToggleOverwriteLCPart1,
    handleToggleOverwriteLCPart2,
    isCustomLCPart2,
    isOverwriteLCPart1,
    isOverwriteLCPart2,
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

          <Button variant="tertiary" startIcon={isEdit ? <IconSave /> : <IconEdit />} onClick={handleToggleMode}>
            {isEdit ? t('tr_editingFinished') : t('tr_meetingPartsEdit')}
          </Button>

          <Divider color="var(--accent-200)" />

          {!hasSource && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconInfo color="var(--accent-400)" />
              <Typography color="var(--grey-400)">{t('tr_meetingMaterialsNotAvailable')}</Typography>
            </Box>
          )}

          {hasSource && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <RowContainer desktopUp={desktopUp}>
                <WeekHeader week={selectedWeek} />

                <PersonSelectorContainer desktopUp={desktopUp}>
                  <PersonSelector
                    week={selectedWeek}
                    label={t('tr_chairman')}
                    type={AssignmentCode.MM_Chairman}
                    assignment="MM_Chairman_A"
                  />
                  {showDoublePerson && (
                    <PersonSelector
                      week={selectedWeek}
                      label={t('tr_auxClassCounselor')}
                      type={AssignmentCode.MM_Chairman}
                      assignment="MM_Chairman_B"
                    />
                  )}
                </PersonSelectorContainer>
              </RowContainer>

              <Divider color="var(--accent-200)" />

              <RowContainer desktopUp={desktopUp}>
                <SongSource week={selectedWeek} meeting="midweek" type="opening" />

                <PersonSelectorContainer desktopUp={desktopUp}>
                  <PersonSelector
                    week={selectedWeek}
                    label={t('tr_prayer')}
                    type={AssignmentCode.MM_Prayer}
                    assignment="MM_OpeningPrayer"
                  />
                </PersonSelectorContainer>
              </RowContainer>

              <Divider color="var(--accent-200)" />

              <MeetingSection
                part={t('tr_treasuresPart')}
                color="var(--treasures-from-gods-word)"
                icon={<IconTreasuresPart color="var(--always-white)" />}
              />

              {/* tgw_talk */}
              <RowContainer desktopUp={desktopUp}>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  {isEdit && <PartDuration length={10} week={selectedWeek} type="tgw_talk" />}

                  <MeetingPart week={selectedWeek} type="tgw_talk" color="var(--treasures-from-gods-word)" />
                </Box>

                <PersonSelectorContainer desktopUp={desktopUp}>
                  <PersonSelector
                    week={selectedWeek}
                    label={t('tr_brother')}
                    type={AssignmentCode.MM_TGWTalk}
                    assignment="MM_TGWTalk"
                  />
                </PersonSelectorContainer>
              </RowContainer>

              <Divider color="var(--accent-200)" />

              {/* tgw_gems */}
              <RowContainer desktopUp={desktopUp}>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  {isEdit && <PartDuration length={10} week={selectedWeek} type="tgw_gems" />}

                  <MeetingPart week={selectedWeek} type="tgw_gems" color="var(--treasures-from-gods-word)" />
                </Box>

                <PersonSelectorContainer desktopUp={desktopUp}>
                  <PersonSelector
                    week={selectedWeek}
                    label={t('tr_brother')}
                    type={AssignmentCode.MM_TGWGems}
                    assignment="MM_TGWGems"
                  />
                </PersonSelectorContainer>
              </RowContainer>

              <Divider color="var(--accent-200)" />

              {/* tgw_bible_reading */}
              <RowContainer desktopUp={desktopUp}>
                <MeetingPart week={selectedWeek} type="tgw_bible_reading" color="var(--treasures-from-gods-word)" />

                <PersonSelectorContainer desktopUp={desktopUp}>
                  <ClassAssignmentContainer>
                    <Typography className="body-small-semibold" color="var(--grey-350)">
                      {t('tr_mainHall')}
                    </Typography>
                    <PersonSelector
                      week={selectedWeek}
                      label={t('tr_student')}
                      type={AssignmentCode.MM_BibleReading}
                      assignment="MM_TGWBibleReading_A"
                    />
                  </ClassAssignmentContainer>

                  {showDoublePerson && (
                    <ClassAssignmentContainer>
                      <Typography className="body-small-semibold" color="var(--grey-350)">
                        {t('tr_auxClass')}
                      </Typography>

                      <PersonSelector
                        week={selectedWeek}
                        label={t('tr_student')}
                        type={AssignmentCode.MM_BibleReading}
                        assignment="MM_TGWBibleReading_B"
                      />
                    </ClassAssignmentContainer>
                  )}
                </PersonSelectorContainer>
              </RowContainer>

              <MeetingSection
                part={t('tr_applyFieldMinistryPart')}
                color="var(--apply-yourself-to-the-field-ministry)"
                icon={<IconMinistryPart color="var(--always-white)" />}
              />

              {/* ayf_part1 */}
              <RowContainer desktopUp={desktopUp}>
                <MeetingPart week={selectedWeek} type="ayf_part1" color="var(--apply-yourself-to-the-field-ministry)" />

                <PersonSelectorContainer desktopUp={desktopUp}>
                  <ClassAssignmentContainer>
                    <Typography className="body-small-semibold" color="var(--grey-350)">
                      {t('tr_mainHall')}
                    </Typography>
                    <PersonDoubleContainer desktopUp={desktopUp} laptopUp={laptopUp}>
                      <PersonSelector
                        week={selectedWeek}
                        label={t('tr_student')}
                        type={ayfPart1}
                        assignment="MM_AYFPart1_Student_A"
                      />

                      {showAYFPart1Assistant && (
                        <PersonSelector
                          week={selectedWeek}
                          label={t('tr_assistant')}
                          type={ayfPart1}
                          assignment="MM_AYFPart1_Assistant_A"
                        />
                      )}
                    </PersonDoubleContainer>
                  </ClassAssignmentContainer>

                  {showDoublePerson && (
                    <ClassAssignmentContainer>
                      <Typography className="body-small-semibold" color="var(--grey-350)">
                        {t('tr_auxClass')}
                      </Typography>
                      <PersonDoubleContainer desktopUp={desktopUp} laptopUp={laptopUp}>
                        <PersonSelector
                          week={selectedWeek}
                          label={t('tr_student')}
                          type={ayfPart1}
                          assignment="MM_AYFPart1_Student_B"
                        />

                        {showAYFPart1Assistant && (
                          <PersonSelector
                            week={selectedWeek}
                            label={t('tr_assistant')}
                            type={ayfPart1}
                            assignment="MM_AYFPart1_Assistant_B"
                          />
                        )}
                      </PersonDoubleContainer>
                    </ClassAssignmentContainer>
                  )}
                </PersonSelectorContainer>
              </RowContainer>

              {/* ayf_part2 */}
              {ayfCount > 1 && (
                <>
                  <Divider color="var(--accent-200)" />

                  <RowContainer desktopUp={desktopUp}>
                    <MeetingPart
                      week={selectedWeek}
                      type="ayf_part2"
                      color="var(--apply-yourself-to-the-field-ministry)"
                    />

                    <PersonSelectorContainer desktopUp={desktopUp}>
                      <ClassAssignmentContainer>
                        <Typography className="body-small-semibold" color="var(--grey-350)">
                          {t('tr_mainHall')}
                        </Typography>
                        <PersonDoubleContainer desktopUp={desktopUp} laptopUp={laptopUp}>
                          <PersonSelector
                            week={selectedWeek}
                            label={t('tr_student')}
                            type={ayfPart2}
                            assignment="MM_AYFPart2_Student_A"
                          />

                          {showAYFPart2Assistant && (
                            <PersonSelector
                              week={selectedWeek}
                              label={t('tr_assistant')}
                              type={ayfPart2}
                              assignment="MM_AYFPart2_Assistant_A"
                            />
                          )}
                        </PersonDoubleContainer>
                      </ClassAssignmentContainer>

                      {showDoublePerson && (
                        <ClassAssignmentContainer>
                          <Typography className="body-small-semibold" color="var(--grey-350)">
                            {t('tr_auxClass')}
                          </Typography>
                          <PersonDoubleContainer desktopUp={desktopUp} laptopUp={laptopUp}>
                            <PersonSelector
                              week={selectedWeek}
                              label={t('tr_student')}
                              type={ayfPart2}
                              assignment="MM_AYFPart2_Student_B"
                            />

                            {showAYFPart2Assistant && (
                              <PersonSelector
                                week={selectedWeek}
                                label={t('tr_assistant')}
                                type={ayfPart2}
                                assignment="MM_AYFPart2_Assistant_B"
                              />
                            )}
                          </PersonDoubleContainer>
                        </ClassAssignmentContainer>
                      )}
                    </PersonSelectorContainer>
                  </RowContainer>
                </>
              )}

              {/* ayf_part3 */}
              {ayfCount > 2 && (
                <>
                  <Divider color="var(--accent-200)" />

                  <RowContainer desktopUp={desktopUp}>
                    <MeetingPart
                      week={selectedWeek}
                      type="ayf_part3"
                      color="var(--apply-yourself-to-the-field-ministry)"
                    />

                    <PersonSelectorContainer desktopUp={desktopUp}>
                      <ClassAssignmentContainer>
                        <Typography className="body-small-semibold" color="var(--grey-350)">
                          {t('tr_mainHall')}
                        </Typography>
                        <PersonDoubleContainer desktopUp={desktopUp} laptopUp={laptopUp}>
                          <PersonSelector
                            week={selectedWeek}
                            label={t('tr_student')}
                            type={ayfPart3}
                            assignment="MM_AYFPart3_Student_A"
                          />

                          {showAYFPart3Assistant && (
                            <PersonSelector
                              week={selectedWeek}
                              label={t('tr_assistant')}
                              type={ayfPart3}
                              assignment="MM_AYFPart3_Assistant_A"
                            />
                          )}
                        </PersonDoubleContainer>
                      </ClassAssignmentContainer>

                      {showDoublePerson && (
                        <ClassAssignmentContainer>
                          <Typography className="body-small-semibold" color="var(--grey-350)">
                            {t('tr_auxClass')}
                          </Typography>
                          <PersonDoubleContainer desktopUp={desktopUp} laptopUp={laptopUp}>
                            <PersonSelector
                              week={selectedWeek}
                              label={t('tr_student')}
                              type={ayfPart3}
                              assignment="MM_AYFPart3_Student_B"
                            />

                            {showAYFPart3Assistant && (
                              <PersonSelector
                                week={selectedWeek}
                                label={t('tr_assistant')}
                                type={ayfPart3}
                                assignment="MM_AYFPart3_Assistant_B"
                              />
                            )}
                          </PersonDoubleContainer>
                        </ClassAssignmentContainer>
                      )}
                    </PersonSelectorContainer>
                  </RowContainer>
                </>
              )}

              {/* ayf_part4 */}
              {ayfCount > 3 && (
                <>
                  <Divider color="var(--accent-200)" />

                  <RowContainer desktopUp={desktopUp}>
                    <MeetingPart
                      week={selectedWeek}
                      type="ayf_part4"
                      color="var(--apply-yourself-to-the-field-ministry)"
                    />

                    <PersonSelectorContainer desktopUp={desktopUp}>
                      <ClassAssignmentContainer>
                        <Typography className="body-small-semibold" color="var(--grey-450)">
                          {t('tr_mainHall')}
                        </Typography>
                        <PersonDoubleContainer desktopUp={desktopUp} laptopUp={laptopUp}>
                          <PersonSelector
                            week={selectedWeek}
                            label={t('tr_student')}
                            type={ayfPart4}
                            assignment="MM_AYFPart4_Student_A"
                          />

                          {showAYFPart4Assistant && (
                            <PersonSelector
                              week={selectedWeek}
                              label={t('tr_assistant')}
                              type={ayfPart4}
                              assignment="MM_AYFPart4_Assistant_A"
                            />
                          )}
                        </PersonDoubleContainer>
                      </ClassAssignmentContainer>

                      {showDoublePerson && (
                        <ClassAssignmentContainer>
                          <Typography className="body-small-semibold" color="var(--grey-450)">
                            {t('tr_auxClass')}
                          </Typography>
                          <PersonDoubleContainer desktopUp={desktopUp} laptopUp={laptopUp}>
                            <PersonSelector
                              week={selectedWeek}
                              label={t('tr_student')}
                              type={ayfPart4}
                              assignment="MM_AYFPart4_Student_B"
                            />

                            {showAYFPart4Assistant && (
                              <PersonSelector
                                week={selectedWeek}
                                label={t('tr_assistant')}
                                type={ayfPart4}
                                assignment="MM_AYFPart4_Assistant_B"
                              />
                            )}
                          </PersonDoubleContainer>
                        </ClassAssignmentContainer>
                      )}
                    </PersonSelectorContainer>
                  </RowContainer>
                </>
              )}

              <MeetingSection
                part={t('tr_livingPart')}
                color="var(--living-as-christians)"
                icon={<IconLivingPart color="var(--always-white)" />}
              />

              <SongSource week={selectedWeek} meeting="midweek" type="middle" />

              <Divider color="var(--accent-200)" />

              {/* lc_part1 */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {isEdit && (
                  <Checkbox
                    label={t('tr_overwriteWithCustomData')}
                    checked={isOverwriteLCPart1}
                    onChange={handleToggleOverwriteLCPart1}
                  />
                )}

                <RowContainer desktopUp={desktopUp}>
                  <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    {isEdit && <PartDuration length={15} week={selectedWeek} type="lc_part1" />}

                    <MeetingPart
                      week={selectedWeek}
                      type="lc_part1"
                      color="var(--living-as-christians)"
                      isOverwrite={isOverwriteLCPart1}
                    />
                  </Box>

                  {!lcNoAssignPart1 && (
                    <PersonSelectorContainer desktopUp={desktopUp}>
                      <PersonSelector
                        week={selectedWeek}
                        label={t('tr_brother')}
                        type={AssignmentCode.MM_LCPart}
                        assignment="MM_LCPart1"
                      />
                    </PersonSelectorContainer>
                  )}
                </RowContainer>
              </Box>

              {/* lc_part2 */}
              {lcCount > 1 && (
                <>
                  <Divider color="var(--accent-200)" />

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {isEdit && !isCustomLCPart2 && (
                      <Checkbox
                        label={t('tr_overwriteWithCustomData')}
                        checked={isOverwriteLCPart2}
                        onChange={handleToggleOverwriteLCPart2}
                      />
                    )}

                    <RowContainer desktopUp={desktopUp}>
                      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        {isEdit && <PartDuration length={15} week={selectedWeek} type="lc_part2" />}

                        <MeetingPart week={selectedWeek} type="lc_part2" color="var(--living-as-christians)" />
                      </Box>

                      {!lcNoAssignPart2 && (
                        <PersonSelectorContainer desktopUp={desktopUp}>
                          <PersonSelector
                            week={selectedWeek}
                            label={t('tr_brother')}
                            type={AssignmentCode.MM_LCPart}
                            assignment="MM_LCPart2"
                          />
                        </PersonSelectorContainer>
                      )}
                    </RowContainer>
                  </Box>
                </>
              )}

              {/* lc_part3 */}
              {lcCount > 2 && (
                <>
                  <Divider color="var(--accent-200)" />

                  <RowContainer desktopUp={desktopUp}>
                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      {isEdit && <PartDuration length={15} week={selectedWeek} type="lc_part3" />}

                      <MeetingPart week={selectedWeek} type="lc_part3" color="var(--living-as-christians)" />
                    </Box>

                    {!lcNoAssignPart3 && (
                      <PersonSelectorContainer desktopUp={desktopUp}>
                        <PersonSelector
                          week={selectedWeek}
                          label={t('tr_brother')}
                          type={AssignmentCode.MM_LCPart}
                          assignment="MM_LCPart3"
                        />
                      </PersonSelectorContainer>
                    )}
                  </RowContainer>
                </>
              )}

              {/* Add custom part */}

              {isEdit && customPartEnabled && (
                <>
                  <Divider color="var(--accent-200)" />

                  <Button variant="small" startIcon={<IconCustom />} sx={{ minHeight: '32px', width: 'fit-content' }}>
                    {t('tr_addCustomMeetingPart')}
                  </Button>
                </>
              )}

              <Divider color="var(--accent-200)" />

              {/* lc_cbs */}
              <RowContainer desktopUp={desktopUp}>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  {isEdit && <PartDuration length={30} week={selectedWeek} type="lc_cbs" />}

                  <MeetingPart week={selectedWeek} type="lc_cbs" color="var(--living-as-christians)" />
                </Box>

                <PersonSelectorContainer desktopUp={desktopUp}>
                  <PersonDoubleContainer desktopUp={desktopUp} laptopUp={laptopUp}>
                    <PersonSelector
                      week={selectedWeek}
                      label={t('tr_cbsConductor')}
                      type={AssignmentCode.MM_CBSConductor}
                      assignment="MM_LCCBSConductor"
                    />
                    <PersonSelector
                      week={selectedWeek}
                      label={t('tr_cbsReader')}
                      type={AssignmentCode.MM_CBSReader}
                      assignment="MM_LCCBSReader"
                    />
                  </PersonDoubleContainer>
                </PersonSelectorContainer>
              </RowContainer>

              <Divider color="var(--accent-200)" />

              {/* closing_prayer */}
              <RowContainer desktopUp={desktopUp}>
                <SongSource
                  week={selectedWeek}
                  meeting="midweek"
                  type="concluding"
                  isEdit={weekType === Week.CO_VISIT && isEdit}
                />

                <PersonSelectorContainer desktopUp={desktopUp}>
                  <PersonSelector
                    week={selectedWeek}
                    label={t('tr_prayer')}
                    type={AssignmentCode.MM_Prayer}
                    assignment="MM_ClosingPrayer"
                  />
                </PersonSelectorContainer>
              </RowContainer>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default MidweekEditor;
