import { Box } from '@mui/material';
import {
  IconClose,
  IconCustom,
  IconDelete,
  IconInfo,
  IconLivingPart,
  IconMinistryPart,
  IconTreasuresPart,
} from '@components/icons';
import { AssignmentCode } from '@definition/assignment';
import { Week } from '@definition/week_type';
import {
  ClassAssignmentContainer,
  PersonDoubleContainer,
  PersonSelectorContainer,
  RowContainer,
} from './index.styles';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useMidweekEditor from './useMidweekEditor';
import AssignmentsWeekDelete from '../assignments_week_delete';
import Button from '@components/button';
import ButtonGroup from '@components/button_group';
import Checkbox from '@components/checkbox';
import COTalk from './co_talk';
import Divider from '@components/divider';
import EventEditor from '../event_editor';
import MeetingPart from '../meeting_part';
import MeetingSection from '../meeting_section';
import PartDuration from '../part_duration';
import PersonSelector from '../person_selector';
import SongSource from '../song_source';
import Typography from '@components/typography';
import WeekHeader from './week_header';
import WeekTypeSelector from '../week_type_selector';

const MidweekEditor = () => {
  const { t } = useAppTranslation();

  const { desktopUp, laptopUp } = useBreakpoints();

  const {
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
    isOverwriteLCPart1,
    isOverwriteLCPart2,
    handleToggleTGW,
    openTGW,
    handleToggleAYF,
    handleToggleLC,
    openAYF,
    openLC,
    handleEditAssignments,
    handleEditParts,
    handleAddCustomLCPart,
    hasCustomPart,
    handleDeleteCustomLCPart,
    clearAll,
    handleCloseClearAll,
    handleOpenClearAll,
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Typography className="h2">{weekDateLocale}</Typography>

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
            <Box
              sx={{ flex: 1, alignSelf: laptopUp ? 'center' : 'flex-start' }}
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
            </Box>
            <Box sx={{ minWidth: laptopUp ? '350px' : '100%' }}>
              <WeekTypeSelector week={selectedWeek} meeting="midweek" />
            </Box>
          </Box>

          <Divider color="var(--accent-200)" />

          {!hasSource && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconInfo color="var(--accent-400)" />
              <Typography color="var(--grey-400)">
                {t('tr_meetingMaterialsNotAvailable')}
              </Typography>
            </Box>
          )}

          {hasSource && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {weekType !== Week.NORMAL && weekType !== Week.CO_VISIT && (
                <EventEditor meeting="midweek" week={selectedWeek} />
              )}

              {(weekType === Week.NORMAL || weekType === Week.CO_VISIT) && (
                <>
                  <RowContainer desktopUp={desktopUp}>
                    <WeekHeader week={selectedWeek} />

                    <PersonSelectorContainer desktopUp={desktopUp}>
                      <PersonSelector
                        week={selectedWeek}
                        label={t('tr_chairman')}
                        type={AssignmentCode.MM_Chairman}
                        assignment="MM_Chairman_A"
                        readOnly={isEdit}
                      />
                      {showDoublePerson && (
                        <PersonSelector
                          week={selectedWeek}
                          label={t('tr_auxClassCounselor')}
                          type={AssignmentCode.MM_Chairman}
                          assignment="MM_Chairman_B"
                          readOnly={isEdit}
                        />
                      )}
                    </PersonSelectorContainer>
                  </RowContainer>

                  <Divider color="var(--accent-200)" />

                  <RowContainer
                    desktopUp={desktopUp}
                    sx={{ alignItems: desktopUp ? 'center' : 'flex-start' }}
                  >
                    <SongSource
                      week={selectedWeek}
                      meeting="midweek"
                      type="opening"
                    />

                    <PersonSelectorContainer desktopUp={desktopUp}>
                      <PersonSelector
                        week={selectedWeek}
                        label={t('tr_prayer')}
                        type={AssignmentCode.MM_Prayer}
                        assignment="MM_OpeningPrayer"
                        readOnly={isEdit}
                      />
                    </PersonSelectorContainer>
                  </RowContainer>

                  <MeetingSection
                    part={t('tr_treasuresPart')}
                    color="var(--treasures-from-gods-word)"
                    icon={<IconTreasuresPart color="var(--always-white)" />}
                    expanded={openTGW}
                    onToggle={handleToggleTGW}
                  >
                    {/* tgw_talk */}
                    <RowContainer desktopUp={desktopUp}>
                      <Box
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
                            length={10}
                            week={selectedWeek}
                            type="tgw_talk"
                          />
                        )}

                        <MeetingPart
                          week={selectedWeek}
                          type="tgw_talk"
                          color="var(--treasures-from-gods-word)"
                        />
                      </Box>

                      <PersonSelectorContainer desktopUp={desktopUp}>
                        <PersonSelector
                          week={selectedWeek}
                          label={t('tr_brother')}
                          type={AssignmentCode.MM_TGWTalk}
                          assignment="MM_TGWTalk"
                          readOnly={isEdit}
                        />
                      </PersonSelectorContainer>
                    </RowContainer>

                    <Divider color="var(--accent-200)" />

                    {/* tgw_gems */}
                    <RowContainer desktopUp={desktopUp}>
                      <Box
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
                            length={10}
                            week={selectedWeek}
                            type="tgw_gems"
                          />
                        )}

                        <MeetingPart
                          week={selectedWeek}
                          type="tgw_gems"
                          color="var(--treasures-from-gods-word)"
                        />
                      </Box>

                      <PersonSelectorContainer desktopUp={desktopUp}>
                        <PersonSelector
                          week={selectedWeek}
                          label={t('tr_brother')}
                          type={AssignmentCode.MM_TGWGems}
                          assignment="MM_TGWGems"
                          readOnly={isEdit}
                        />
                      </PersonSelectorContainer>
                    </RowContainer>

                    <Divider color="var(--accent-200)" />

                    {/* tgw_bible_reading */}
                    <RowContainer desktopUp={desktopUp}>
                      <MeetingPart
                        week={selectedWeek}
                        type="tgw_bible_reading"
                        color="var(--treasures-from-gods-word)"
                      />

                      <PersonSelectorContainer desktopUp={desktopUp}>
                        <ClassAssignmentContainer>
                          <Typography
                            className="body-small-semibold"
                            color="var(--grey-350)"
                          >
                            {t('tr_mainHall')}
                          </Typography>
                          <PersonSelector
                            week={selectedWeek}
                            label={t('tr_student')}
                            type={AssignmentCode.MM_BibleReading}
                            assignment="MM_TGWBibleReading_A"
                            readOnly={isEdit}
                          />
                        </ClassAssignmentContainer>

                        {showDoublePerson && (
                          <ClassAssignmentContainer>
                            <Typography
                              className="body-small-semibold"
                              color="var(--grey-350)"
                            >
                              {t('tr_auxClass')}
                            </Typography>

                            <PersonSelector
                              week={selectedWeek}
                              label={t('tr_student')}
                              type={AssignmentCode.MM_BibleReading}
                              assignment="MM_TGWBibleReading_B"
                              readOnly={isEdit}
                            />
                          </ClassAssignmentContainer>
                        )}
                      </PersonSelectorContainer>
                    </RowContainer>
                  </MeetingSection>

                  <MeetingSection
                    part={t('tr_applyFieldMinistryPart')}
                    color="var(--apply-yourself-to-the-field-ministry)"
                    icon={<IconMinistryPart color="var(--always-white)" />}
                    expanded={openAYF}
                    onToggle={handleToggleAYF}
                  >
                    {/* ayf_part1 */}
                    <RowContainer desktopUp={desktopUp}>
                      <MeetingPart
                        week={selectedWeek}
                        type="ayf_part1"
                        color="var(--apply-yourself-to-the-field-ministry)"
                      />

                      <PersonSelectorContainer desktopUp={desktopUp}>
                        <ClassAssignmentContainer>
                          <Typography
                            className="body-small-semibold"
                            color="var(--grey-350)"
                          >
                            {t('tr_mainHall')}
                          </Typography>
                          <PersonDoubleContainer
                            desktopUp={desktopUp}
                            laptopUp={laptopUp}
                          >
                            <PersonSelector
                              week={selectedWeek}
                              label={t('tr_student')}
                              type={ayfPart1}
                              assignment="MM_AYFPart1_Student_A"
                              readOnly={isEdit}
                            />

                            {showAYFPart1Assistant && (
                              <PersonSelector
                                week={selectedWeek}
                                label={t('tr_assistant')}
                                type={ayfPart1}
                                assignment="MM_AYFPart1_Assistant_A"
                                readOnly={isEdit}
                              />
                            )}
                          </PersonDoubleContainer>
                        </ClassAssignmentContainer>

                        {showDoublePerson && (
                          <ClassAssignmentContainer>
                            <Typography
                              className="body-small-semibold"
                              color="var(--grey-350)"
                            >
                              {t('tr_auxClass')}
                            </Typography>
                            <PersonDoubleContainer
                              desktopUp={desktopUp}
                              laptopUp={laptopUp}
                            >
                              <PersonSelector
                                week={selectedWeek}
                                label={t('tr_student')}
                                type={ayfPart1}
                                assignment="MM_AYFPart1_Student_B"
                                readOnly={isEdit}
                              />

                              {showAYFPart1Assistant && (
                                <PersonSelector
                                  week={selectedWeek}
                                  label={t('tr_assistant')}
                                  type={ayfPart1}
                                  assignment="MM_AYFPart1_Assistant_B"
                                  readOnly={isEdit}
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
                              <Typography
                                className="body-small-semibold"
                                color="var(--grey-350)"
                              >
                                {t('tr_mainHall')}
                              </Typography>
                              <PersonDoubleContainer
                                desktopUp={desktopUp}
                                laptopUp={laptopUp}
                              >
                                <PersonSelector
                                  week={selectedWeek}
                                  label={t('tr_student')}
                                  type={ayfPart2}
                                  assignment="MM_AYFPart2_Student_A"
                                  readOnly={isEdit}
                                />

                                {showAYFPart2Assistant && (
                                  <PersonSelector
                                    week={selectedWeek}
                                    label={t('tr_assistant')}
                                    type={ayfPart2}
                                    assignment="MM_AYFPart2_Assistant_A"
                                    readOnly={isEdit}
                                  />
                                )}
                              </PersonDoubleContainer>
                            </ClassAssignmentContainer>

                            {showDoublePerson && (
                              <ClassAssignmentContainer>
                                <Typography
                                  className="body-small-semibold"
                                  color="var(--grey-350)"
                                >
                                  {t('tr_auxClass')}
                                </Typography>
                                <PersonDoubleContainer
                                  desktopUp={desktopUp}
                                  laptopUp={laptopUp}
                                >
                                  <PersonSelector
                                    week={selectedWeek}
                                    label={t('tr_student')}
                                    type={ayfPart2}
                                    assignment="MM_AYFPart2_Student_B"
                                    readOnly={isEdit}
                                  />

                                  {showAYFPart2Assistant && (
                                    <PersonSelector
                                      week={selectedWeek}
                                      label={t('tr_assistant')}
                                      type={ayfPart2}
                                      assignment="MM_AYFPart2_Assistant_B"
                                      readOnly={isEdit}
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
                              <Typography
                                className="body-small-semibold"
                                color="var(--grey-350)"
                              >
                                {t('tr_mainHall')}
                              </Typography>
                              <PersonDoubleContainer
                                desktopUp={desktopUp}
                                laptopUp={laptopUp}
                              >
                                <PersonSelector
                                  week={selectedWeek}
                                  label={t('tr_student')}
                                  type={ayfPart3}
                                  assignment="MM_AYFPart3_Student_A"
                                  readOnly={isEdit}
                                />

                                {showAYFPart3Assistant && (
                                  <PersonSelector
                                    week={selectedWeek}
                                    label={t('tr_assistant')}
                                    type={ayfPart3}
                                    assignment="MM_AYFPart3_Assistant_A"
                                    readOnly={isEdit}
                                  />
                                )}
                              </PersonDoubleContainer>
                            </ClassAssignmentContainer>

                            {showDoublePerson && (
                              <ClassAssignmentContainer>
                                <Typography
                                  className="body-small-semibold"
                                  color="var(--grey-350)"
                                >
                                  {t('tr_auxClass')}
                                </Typography>
                                <PersonDoubleContainer
                                  desktopUp={desktopUp}
                                  laptopUp={laptopUp}
                                >
                                  <PersonSelector
                                    week={selectedWeek}
                                    label={t('tr_student')}
                                    type={ayfPart3}
                                    assignment="MM_AYFPart3_Student_B"
                                    readOnly={isEdit}
                                  />

                                  {showAYFPart3Assistant && (
                                    <PersonSelector
                                      week={selectedWeek}
                                      label={t('tr_assistant')}
                                      type={ayfPart3}
                                      assignment="MM_AYFPart3_Assistant_B"
                                      readOnly={isEdit}
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
                              <Typography
                                className="body-small-semibold"
                                color="var(--grey-450)"
                              >
                                {t('tr_mainHall')}
                              </Typography>
                              <PersonDoubleContainer
                                desktopUp={desktopUp}
                                laptopUp={laptopUp}
                              >
                                <PersonSelector
                                  week={selectedWeek}
                                  label={t('tr_student')}
                                  type={ayfPart4}
                                  assignment="MM_AYFPart4_Student_A"
                                  readOnly={isEdit}
                                />

                                {showAYFPart4Assistant && (
                                  <PersonSelector
                                    week={selectedWeek}
                                    label={t('tr_assistant')}
                                    type={ayfPart4}
                                    assignment="MM_AYFPart4_Assistant_A"
                                    readOnly={isEdit}
                                  />
                                )}
                              </PersonDoubleContainer>
                            </ClassAssignmentContainer>

                            {showDoublePerson && (
                              <ClassAssignmentContainer>
                                <Typography
                                  className="body-small-semibold"
                                  color="var(--grey-450)"
                                >
                                  {t('tr_auxClass')}
                                </Typography>
                                <PersonDoubleContainer
                                  desktopUp={desktopUp}
                                  laptopUp={laptopUp}
                                >
                                  <PersonSelector
                                    week={selectedWeek}
                                    label={t('tr_student')}
                                    type={ayfPart4}
                                    assignment="MM_AYFPart4_Student_B"
                                    readOnly={isEdit}
                                  />

                                  {showAYFPart4Assistant && (
                                    <PersonSelector
                                      week={selectedWeek}
                                      label={t('tr_assistant')}
                                      type={ayfPart4}
                                      assignment="MM_AYFPart4_Assistant_B"
                                      readOnly={isEdit}
                                    />
                                  )}
                                </PersonDoubleContainer>
                              </ClassAssignmentContainer>
                            )}
                          </PersonSelectorContainer>
                        </RowContainer>
                      </>
                    )}
                  </MeetingSection>

                  <MeetingSection
                    part={t('tr_livingPart')}
                    color="var(--living-as-christians)"
                    icon={<IconLivingPart color="var(--always-white)" />}
                    expanded={openLC}
                    onToggle={handleToggleLC}
                  >
                    <SongSource
                      week={selectedWeek}
                      meeting="midweek"
                      type="middle"
                    />

                    <Divider color="var(--accent-200)" />

                    {/* lc_part1 */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                      }}
                    >
                      {isEdit && (
                        <Checkbox
                          label={t('tr_overwriteWithCustomData')}
                          checked={isOverwriteLCPart1}
                          onChange={handleToggleOverwriteLCPart1}
                        />
                      )}

                      <RowContainer desktopUp={desktopUp}>
                        <Box
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
                              length={15}
                              week={selectedWeek}
                              type="lc_part1"
                            />
                          )}

                          <MeetingPart
                            week={selectedWeek}
                            type="lc_part1"
                            color="var(--living-as-christians)"
                            isOverwrite={isOverwriteLCPart1}
                            isEdit={isEdit}
                          />
                        </Box>

                        {!lcNoAssignPart1 && (
                          <PersonSelectorContainer desktopUp={desktopUp}>
                            <PersonSelector
                              week={selectedWeek}
                              label={t('tr_brother')}
                              type={AssignmentCode.MM_LCPart}
                              assignment="MM_LCPart1"
                              readOnly={isEdit}
                            />
                          </PersonSelectorContainer>
                        )}
                      </RowContainer>
                    </Box>

                    {/* lc_part2 */}
                    {lcCount > 1 && (
                      <>
                        <Divider color="var(--accent-200)" />

                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                          }}
                        >
                          {isEdit && (
                            <Checkbox
                              label={t('tr_overwriteWithCustomData')}
                              checked={isOverwriteLCPart2}
                              onChange={handleToggleOverwriteLCPart2}
                            />
                          )}

                          <RowContainer desktopUp={desktopUp}>
                            <Box
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
                                  length={15}
                                  week={selectedWeek}
                                  type="lc_part2"
                                />
                              )}

                              <MeetingPart
                                week={selectedWeek}
                                type="lc_part2"
                                color="var(--living-as-christians)"
                                isOverwrite={isOverwriteLCPart2}
                              />
                            </Box>

                            {!lcNoAssignPart2 && (
                              <PersonSelectorContainer desktopUp={desktopUp}>
                                <PersonSelector
                                  week={selectedWeek}
                                  label={t('tr_brother')}
                                  type={AssignmentCode.MM_LCPart}
                                  assignment="MM_LCPart2"
                                  readOnly={isEdit}
                                />
                              </PersonSelectorContainer>
                            )}
                          </RowContainer>
                        </Box>
                      </>
                    )}

                    {/* lc_part3 */}
                    {hasCustomPart && (
                      <>
                        <Divider color="var(--accent-200)" />

                        <Typography color="var(--grey-350)">
                          {t('tr_customMeetingPartDesc')}
                        </Typography>

                        <RowContainer
                          desktopUp={desktopUp}
                          sx={{ alignItems: 'flex-start' }}
                        >
                          <Box
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
                                length={15}
                                week={selectedWeek}
                                type="lc_part3"
                              />
                            )}

                            <MeetingPart
                              week={selectedWeek}
                              type="lc_part3"
                              color="var(--living-as-christians)"
                              isEdit={isEdit}
                              isOverwrite={true}
                            />
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-end',
                              gap: '16px',
                              width: desktopUp ? 'unset' : '100%',
                            }}
                          >
                            {!lcNoAssignPart3 && (
                              <PersonSelectorContainer desktopUp={desktopUp}>
                                <PersonSelector
                                  week={selectedWeek}
                                  label={t('tr_brother')}
                                  type={AssignmentCode.MM_LCPart}
                                  assignment="MM_LCPart3"
                                  readOnly={isEdit}
                                />
                              </PersonSelectorContainer>
                            )}

                            <Button
                              variant="small"
                              color="red"
                              startIcon={<IconDelete />}
                              sx={{ minHeight: '32px', width: 'fit-content' }}
                              onClick={handleDeleteCustomLCPart}
                            >
                              {t('tr_customMeetingPartDelete')}
                            </Button>
                          </Box>
                        </RowContainer>
                      </>
                    )}

                    {/* Add custom part */}

                    {isEdit && customPartEnabled && (
                      <>
                        <Divider color="var(--accent-200)" />

                        <Button
                          variant="small"
                          startIcon={<IconCustom />}
                          sx={{ minHeight: '32px', width: 'fit-content' }}
                          onClick={handleAddCustomLCPart}
                        >
                          {t('tr_addCustomMeetingPart')}
                        </Button>
                      </>
                    )}

                    <Divider color="var(--accent-200)" />

                    {/* lc_cbs */}
                    {weekType !== Week.CO_VISIT && (
                      <RowContainer
                        desktopUp={desktopUp}
                        sx={{ alignItems: 'flex-start' }}
                      >
                        <Box
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
                        </Box>

                        <PersonSelectorContainer desktopUp={desktopUp}>
                          <PersonDoubleContainer
                            desktopUp={desktopUp}
                            laptopUp={laptopUp}
                          >
                            <PersonSelector
                              week={selectedWeek}
                              label={t('tr_cbsConductor')}
                              type={AssignmentCode.MM_CBSConductor}
                              assignment="MM_LCCBSConductor"
                              readOnly={isEdit}
                            />
                            <PersonSelector
                              week={selectedWeek}
                              label={t('tr_cbsReader')}
                              type={AssignmentCode.MM_CBSReader}
                              assignment="MM_LCCBSReader"
                              readOnly={isEdit}
                            />
                          </PersonDoubleContainer>
                        </PersonSelectorContainer>
                      </RowContainer>
                    )}

                    {/* CO talk */}
                    {weekType === Week.CO_VISIT && (
                      <COTalk week={selectedWeek} meeting="midweek" />
                    )}

                    <Divider color="var(--accent-200)" />
                  </MeetingSection>

                  {/* closing_prayer */}
                  <RowContainer desktopUp={desktopUp}>
                    <SongSource
                      week={selectedWeek}
                      meeting="midweek"
                      type="concluding"
                      isEdit={isEdit || weekType === Week.CO_VISIT}
                    />

                    <PersonSelectorContainer desktopUp={desktopUp}>
                      <PersonSelector
                        week={selectedWeek}
                        label={t('tr_prayer')}
                        type={AssignmentCode.MM_Prayer}
                        assignment="MM_ClosingPrayer"
                        readOnly={isEdit}
                      />
                    </PersonSelectorContainer>
                  </RowContainer>

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
