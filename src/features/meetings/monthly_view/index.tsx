import { Box } from '@mui/material';
import useAppTranslation from '@hooks/useAppTranslation';
import { MenuItem, Select, Typography } from '@components/index';
import WeekBadge from './week_badge';
import PersonSelector from '../person_selector';
import { AssignmentCode } from '@definition/assignment';
import Divider from '@components/divider';
import {
  IconLivingPart,
  IconMinistryPart,
  IconTreasuresPart,
} from '@components/icons';
import MeetingSection from '../meeting_section';
import { Week } from '@definition/week_type';
import useMonthlyView from './useMonthlyView';

const MonthlyView = () => {
  const {
    selectedWeeks,
    weeksTypes,
    getWeekLocale,
    selectedMonth,
    monthNames,
    setSelectedMonth,
    classCount,
    showDoublePerson,
    openingPrayerAuto,
    closingPrayerAuto,
    openTGW,
    openAYF,
    openLC,
    handleToggleTGW,
    handleToggleAYF,
    handleToggleLC,
    ayfParts1,
    ayfParts2,
    ayfParts3,
    ayfParts4,
    ayfCount,
    showAYFParts1Assistant,
    showAYFParts2Assistant,
    showAYFParts3Assistant,
    showAYFParts4Assistant,
    showAYFParts1DoublePerson,
    showAYFParts2DoublePerson,
    showAYFParts3DoublePerson,
    showAYFParts4DoublePerson,
    lcNoAssignParts1,
    lcNoAssignParts2,
    lcNoAssignParts3,
    hasCustomPart,
    lcCount,
  } = useMonthlyView();

  const { t } = useAppTranslation();

  return (
    <Box
      sx={{
        padding: '16px',
        gap: '12px',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--accent-300)',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'var(--white)',
      }}
    >
      {/* --------------------------- MonhlyView Header -------------------------- */}
      <Box
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          display: 'flex',
          gap: '16px',
        }}
      >
        <Select
          label={t('tr_month')}
          sx={{
            maxWidth: '196px',
          }}
          value={selectedMonth.toString()}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
        >
          {monthNames.map((value, index) => {
            return (
              <MenuItem value={index} key={index}>
                {value}
              </MenuItem>
            );
          })}
        </Select>
        {selectedWeeks.map((value, index) => {
          return (
            <WeekBadge
              key={index}
              text={getWeekLocale(
                new Date(value).getDate(),
                monthNames[selectedMonth]
              )}
            />
          );
        })}
      </Box>
      {/* -------------------------------- Chairman -------------------------------- */}
      <Box
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          display: 'flex',
          gap: '16px',
        }}
      >
        <Typography className="h4" color={'var(--black)'} width={`${196}px`}>
          {t('tr_chairman')}
        </Typography>
        {selectedWeeks.map((value, index) => {
          return (
            <PersonSelector
              key={`main-hall-chairman-${index}`}
              week={value}
              notShowIcon
              label={t('tr_chairman')}
              type={AssignmentCode.MM_Chairman}
              assignment="MM_Chairman_A"
              readOnly={false}
            />
          );
        })}
      </Box>
      <Divider color="var(--grey-200)" />
      {classCount === 2 && (
        <>
          <Box
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              display: 'flex',
              gap: '16px',
            }}
          >
            <Typography
              className="h4"
              color={'var(--black)'}
              width={`${196}px`}
            >
              {t('tr_auxClassCounselor')}
            </Typography>
            {selectedWeeks.map((value, index) => {
              return showDoublePerson[index] ? (
                <PersonSelector
                  key={`aux-classroom-counselor-${index}`}
                  week={value}
                  notShowIcon
                  label={t('tr_chairman')}
                  type={AssignmentCode.MM_AuxiliaryCounselor}
                  assignment="MM_Chairman_B"
                  readOnly={false}
                />
              ) : (
                <Box flex={1}></Box>
              );
            })}
          </Box>
          <Divider color="var(--grey-200)" />
        </>
      )}
      {/* ----------------------------- Opening prayer ----------------------------- */}
      {!openingPrayerAuto && (
        <Box
          sx={{
            flexDirection: 'row',
            alignItems: 'center',
            display: 'flex',
            gap: '16px',
          }}
        >
          <Typography className="h4" color={'var(--black)'} width={`${196}px`}>
            {t('tr_openingPrayer')}
          </Typography>
          {selectedWeeks.map((value, index) => {
            return (
              <PersonSelector
                key={`opening-prayer-${index}`}
                week={value}
                notShowIcon
                label={t('tr_prayer')}
                type={AssignmentCode.MM_Prayer}
                assignment="MM_OpeningPrayer"
                readOnly={false}
              />
            );
          })}
        </Box>
      )}
      {/* ------------------------ Treasures from God’s Word ----------------------- */}
      <MeetingSection
        part={t('tr_treasuresPart')}
        color="var(--treasures-from-gods-word)"
        icon={<IconTreasuresPart color="var(--always-white)" />}
        expanded={openTGW}
        onToggle={handleToggleTGW}
      >
        {/* --- tgw_talk --- */}
        <>
          <Box
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              display: 'flex',
              gap: '16px',
            }}
          >
            <Typography
              className="h4"
              color={'var(--text-treasures-from-gods-word)'}
              width={`${196}px`}
            >
              {t('tr_tgwTalk')}
            </Typography>
            {selectedWeeks.map((value, index) => {
              return (
                <PersonSelector
                  week={value}
                  key={`tgw-talk-${index}`}
                  notShowIcon
                  label={t('tr_conductor')}
                  type={AssignmentCode.MM_TGWTalk}
                  assignment="MM_TGWTalk"
                  readOnly={false}
                />
              );
            })}
          </Box>
          <Divider color="var(--grey-200)" />
        </>
        {/* --- tgw_gems --- */}
        <>
          <Box
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              display: 'flex',
              gap: '16px',
            }}
          >
            <Typography
              className="h4"
              color={'var(--text-treasures-from-gods-word)'}
              width={`${196}px`}
            >
              {t('tr_tgwGems')}
            </Typography>
            {selectedWeeks.map((value, index) => {
              return (
                <PersonSelector
                  week={value}
                  key={`tgw-gems-${index}`}
                  notShowIcon
                  label={t('tr_conductor')}
                  type={AssignmentCode.MM_TGWGems}
                  assignment="MM_TGWGems"
                  readOnly={false}
                />
              );
            })}
          </Box>
          <Divider color="var(--grey-200)" />
        </>
        {/* --- tgw_bible_reading --- */}
        <>
          <Box
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              display: 'flex',
              gap: '16px',
            }}
          >
            <Box width={'196px'}></Box>
            <Typography
              className="body-small-semibold"
              color={'var(--grey-350)'}
            >
              {t('tr_mainHall')}
            </Typography>
          </Box>
          <Box
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              display: 'flex',
              gap: '16px',
            }}
          >
            <Typography
              className="h4"
              color={'var(--text-treasures-from-gods-word)'}
              width={`${196}px`}
            >
              {t('tr_bibleReading')}
            </Typography>
            {selectedWeeks.map((value, index) => {
              return (
                <PersonSelector
                  key={`main-hall-reader-${index}`}
                  week={value}
                  notShowIcon
                  label={t('tr_student')}
                  type={AssignmentCode.MM_BibleReading}
                  assignment="MM_TGWBibleReading_A"
                  readOnly={false}
                />
              );
            })}
          </Box>
          {classCount === 2 && (
            <>
              <Box
                sx={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  display: 'flex',
                  gap: '16px',
                }}
              >
                <Box width={'196px'}></Box>
                <Typography
                  className="body-small-semibold"
                  color={'var(--grey-350)'}
                >
                  {t('tr_auxClassroom')}
                </Typography>
              </Box>
              <Box
                sx={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  display: 'flex',
                  gap: '16px',
                }}
              >
                <Box width={'196px'}></Box>
                {selectedWeeks.map((value, index) => {
                  return showDoublePerson[index] ? (
                    <PersonSelector
                      key={`aux-classroom-reader-${index}`}
                      week={value}
                      notShowIcon
                      label={t('tr_student')}
                      type={AssignmentCode.MM_BibleReading}
                      assignment="MM_TGWBibleReading_B"
                      readOnly={false}
                    />
                  ) : (
                    <Box flex={1} />
                  );
                })}
              </Box>
            </>
          )}
        </>
      </MeetingSection>
      {/* ------------------ Apply yourself to the field ministry ------------------ */}
      <MeetingSection
        part={t('tr_applyFieldMinistryPart')}
        color="var(--apply-yourself-to-the-field-ministry)"
        icon={<IconMinistryPart color="var(--always-white)" />}
        expanded={openAYF}
        onToggle={handleToggleAYF}
      >
        {/* --- ayf_part1 --- */}
        <>
          <Box
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              display: 'flex',
              gap: '16px',
            }}
          >
            <Box width={'196px'}></Box>
            <Typography
              className="body-small-semibold"
              color={'var(--grey-350)'}
            >
              {t('tr_mainHall')}
            </Typography>
          </Box>
          <Box
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              display: 'flex',
              gap: '16px',
            }}
          >
            <Typography
              className="h4"
              color={'var(--apply-yourself-to-the-field-ministry)'}
              width={'196px'}
            >
              {t('tr_ayfAssignment', { assignmentNumber: '1' })}
            </Typography>
            {selectedWeeks.map((value, index) => {
              return (
                <Box
                  flex={1}
                  key={`ayf-part1-${index}`}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <PersonSelector
                    week={value}
                    label={
                      ayfParts1[index] === AssignmentCode.MM_Discussion
                        ? t('tr_brother')
                        : t('tr_student')
                    }
                    type={ayfParts1[index]}
                    assignment="MM_AYFPart1_Student_A"
                    notShowIcon
                    readOnly={false}
                  />
                  {showAYFParts1Assistant[index] ? (
                    <PersonSelector
                      week={value}
                      label={t('tr_assistant')}
                      type={ayfParts1[index]}
                      assignment="MM_AYFPart1_Assistant_A"
                      readOnly={false}
                      notShowIcon
                    />
                  ) : (
                    <Box height={48} />
                  )}
                </Box>
              );
            })}
          </Box>
          {classCount === 2 && (
            <>
              <Box
                sx={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  display: 'flex',
                  gap: '16px',
                }}
              >
                <Box width={'196px'}></Box>
                <Typography
                  className="body-small-semibold"
                  color={'var(--grey-350)'}
                >
                  {t('tr_auxClassroom')}
                </Typography>
              </Box>
              <Box
                sx={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  display: 'flex',
                  gap: '16px',
                }}
              >
                <Box width={'196px'} />
                {selectedWeeks.map((value, index) => {
                  return (
                    showAYFParts1DoublePerson && (
                      <Box
                        flex={1}
                        key={`ayf-part1-aux-classroom-${index}`}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        }}
                      >
                        <PersonSelector
                          week={value}
                          label={t('tr_student')}
                          type={ayfParts1[index]}
                          assignment="MM_AYFPart1_Student_B"
                          readOnly={false}
                          notShowIcon
                        />
                        {showAYFParts1Assistant[index] ? (
                          <PersonSelector
                            week={value}
                            label={t('tr_assistant')}
                            type={ayfParts1[index]}
                            assignment="MM_AYFPart1_Assistant_B"
                            readOnly={false}
                            notShowIcon
                          />
                        ) : (
                          <Box height={48} />
                        )}
                      </Box>
                    )
                  );
                })}
              </Box>
            </>
          )}
          <Divider color="var(--grey-200)" />
        </>
        {/* --- ayf_part2 --- */}
        <>
          <Box
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              display: 'flex',
              gap: '16px',
            }}
          >
            <Box width={'196px'}></Box>
            <Typography
              className="body-small-semibold"
              color={'var(--grey-350)'}
            >
              {t('tr_mainHall')}
            </Typography>
          </Box>
          <Box
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              display: 'flex',
              gap: '16px',
            }}
          >
            <Typography
              className="h4"
              color={'var(--apply-yourself-to-the-field-ministry)'}
              width={'196px'}
            >
              {t('tr_ayfAssignment', { assignmentNumber: '2' })}
            </Typography>
            {selectedWeeks.map((value, index) => {
              return ayfCount[index] > 1 ? (
                <Box
                  flex={1}
                  key={`ayf-part2-${index}`}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <PersonSelector
                    week={value}
                    label={
                      ayfParts2[index] === AssignmentCode.MM_Discussion
                        ? t('tr_brother')
                        : t('tr_student')
                    }
                    type={ayfParts2[index]}
                    assignment="MM_AYFPart2_Student_A"
                    notShowIcon
                    readOnly={false}
                  />
                  {showAYFParts2Assistant[index] ? (
                    <PersonSelector
                      week={value}
                      label={t('tr_assistant')}
                      type={ayfParts2[index]}
                      assignment="MM_AYFPart2_Assistant_A"
                      readOnly={false}
                      notShowIcon
                    />
                  ) : (
                    <Box height={48} />
                  )}
                </Box>
              ) : (
                <Box flex={1} />
              );
            })}
          </Box>
          {classCount === 2 && (
            <>
              <Box
                sx={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  display: 'flex',
                  gap: '16px',
                }}
              >
                <Box width={'196px'}></Box>
                <Typography
                  className="body-small-semibold"
                  color={'var(--grey-350)'}
                >
                  {t('tr_auxClassroom')}
                </Typography>
              </Box>
              <Box
                sx={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  display: 'flex',
                  gap: '16px',
                }}
              >
                <Box width={'196px'} />
                {selectedWeeks.map((value, index) => {
                  return ayfCount[index] > 1 && showAYFParts2DoublePerson ? (
                    <Box
                      flex={1}
                      key={`ayf-part2-aux-classroom-${index}`}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      <PersonSelector
                        week={value}
                        label={t('tr_student')}
                        type={ayfParts2[index]}
                        assignment="MM_AYFPart2_Student_B"
                        readOnly={false}
                        notShowIcon
                      />
                      {showAYFParts2Assistant[index] ? (
                        <PersonSelector
                          week={value}
                          label={t('tr_assistant')}
                          type={ayfParts2[index]}
                          assignment="MM_AYFPart2_Assistant_B"
                          readOnly={false}
                          notShowIcon
                        />
                      ) : (
                        <Box height={48} />
                      )}
                    </Box>
                  ) : (
                    <Box flex={1} />
                  );
                })}
              </Box>
            </>
          )}
          <Divider color="var(--grey-200)" />
        </>
        {/* --- ayf_part3 --- */}
        <>
          <Box
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              display: 'flex',
              gap: '16px',
            }}
          >
            <Box width={'196px'}></Box>
            <Typography
              className="body-small-semibold"
              color={'var(--grey-350)'}
            >
              {t('tr_mainHall')}
            </Typography>
          </Box>
          <Box
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              display: 'flex',
              gap: '16px',
            }}
          >
            <Typography
              className="h4"
              color={'var(--apply-yourself-to-the-field-ministry)'}
              width={'196px'}
            >
              {t('tr_ayfAssignment', { assignmentNumber: '3' })}
            </Typography>
            {selectedWeeks.map((value, index) => {
              return ayfCount[index] > 2 ? (
                <Box
                  flex={1}
                  key={`ayf-part3-${index}`}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <PersonSelector
                    week={value}
                    label={
                      ayfParts3[index] === AssignmentCode.MM_Discussion
                        ? t('tr_brother')
                        : t('tr_student')
                    }
                    type={ayfParts3[index]}
                    assignment="MM_AYFPart3_Student_A"
                    notShowIcon
                    readOnly={false}
                  />
                  {showAYFParts3Assistant[index] ? (
                    <PersonSelector
                      week={value}
                      label={t('tr_assistant')}
                      type={ayfParts3[index]}
                      assignment="MM_AYFPart3_Assistant_A"
                      readOnly={false}
                      notShowIcon
                    />
                  ) : (
                    <Box height={48} />
                  )}
                </Box>
              ) : (
                <Box flex={1} />
              );
            })}
          </Box>
          {classCount === 2 && (
            <>
              <Box
                sx={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  display: 'flex',
                  gap: '16px',
                }}
              >
                <Box width={'196px'}></Box>
                <Typography
                  className="body-small-semibold"
                  color={'var(--grey-350)'}
                >
                  {t('tr_auxClassroom')}
                </Typography>
              </Box>
              <Box
                sx={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  display: 'flex',
                  gap: '16px',
                }}
              >
                <Box width={'196px'} />
                {selectedWeeks.map((value, index) => {
                  return ayfCount[index] > 2 && showAYFParts3DoublePerson ? (
                    <Box
                      flex={1}
                      key={`ayf-part3-aux-classroom-${index}`}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      <PersonSelector
                        week={value}
                        label={t('tr_student')}
                        type={ayfParts3[index]}
                        assignment="MM_AYFPart3_Student_B"
                        readOnly={false}
                        notShowIcon
                      />
                      {showAYFParts3Assistant[index] ? (
                        <PersonSelector
                          week={value}
                          label={t('tr_assistant')}
                          type={ayfParts3[index]}
                          assignment="MM_AYFPart3_Assistant_B"
                          readOnly={false}
                          notShowIcon
                        />
                      ) : (
                        <Box height={48} />
                      )}
                    </Box>
                  ) : (
                    <Box flex={1} />
                  );
                })}
              </Box>
            </>
          )}
          <Divider color="var(--grey-200)" />
        </>
        {/* --- ayf_part4 --- */}
        {ayfCount.some((ayfAssign) => ayfAssign > 3) && (
          <>
            <Box
              sx={{
                flexDirection: 'row',
                alignItems: 'center',
                display: 'flex',
                gap: '16px',
              }}
            >
              <Box width={'196px'}></Box>
              <Typography
                className="body-small-semibold"
                color={'var(--grey-350)'}
              >
                {t('tr_mainHall')}
              </Typography>
            </Box>
            <Box
              sx={{
                flexDirection: 'row',
                alignItems: 'center',
                display: 'flex',
                gap: '16px',
              }}
            >
              <Typography
                className="h4"
                color={'var(--apply-yourself-to-the-field-ministry)'}
                width={'196px'}
              >
                {t('tr_ayfAssignment', { assignmentNumber: '4' })}
              </Typography>
              {selectedWeeks.map((value, index) => {
                return ayfCount[index] > 3 ? (
                  <Box
                    flex={1}
                    key={`ayf-part4-${index}`}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <PersonSelector
                      week={value}
                      label={
                        ayfParts4[index] === AssignmentCode.MM_Discussion
                          ? t('tr_brother')
                          : t('tr_student')
                      }
                      type={ayfParts4[index]}
                      assignment="MM_AYFPart4_Student_A"
                      notShowIcon
                      readOnly={false}
                    />
                    {showAYFParts4Assistant[index] ? (
                      <PersonSelector
                        week={value}
                        label={t('tr_assistant')}
                        type={ayfParts4[index]}
                        assignment="MM_AYFPart4_Assistant_A"
                        readOnly={false}
                        notShowIcon
                      />
                    ) : (
                      <Box height={48} />
                    )}
                  </Box>
                ) : (
                  <Box flex={1} />
                );
              })}
            </Box>
            {classCount === 2 && (
              <>
                <Box
                  sx={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    display: 'flex',
                    gap: '16px',
                  }}
                >
                  <Box width={'196px'}></Box>
                  <Typography
                    className="body-small-semibold"
                    color={'var(--grey-350)'}
                  >
                    {t('tr_auxClassroom')}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    display: 'flex',
                    gap: '16px',
                  }}
                >
                  <Box width={'196px'} />
                  {selectedWeeks.map((value, index) => {
                    return ayfCount[index] > 3 && showAYFParts4DoublePerson ? (
                      <Box
                        flex={1}
                        key={`ayf-part4-aux-classroom-${index}`}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        }}
                      >
                        <PersonSelector
                          week={value}
                          label={t('tr_student')}
                          type={ayfParts4[index]}
                          assignment="MM_AYFPart4_Student_B"
                          readOnly={false}
                          notShowIcon
                        />
                        {showAYFParts4Assistant[index] ? (
                          <PersonSelector
                            week={value}
                            label={t('tr_assistant')}
                            type={ayfParts4[index]}
                            assignment="MM_AYFPart4_Assistant_B"
                            readOnly={false}
                            notShowIcon
                          />
                        ) : (
                          <Box height={48} />
                        )}
                      </Box>
                    ) : (
                      <Box flex={1} />
                    );
                  })}
                </Box>
              </>
            )}
          </>
        )}
      </MeetingSection>
      {/* -------------------------- Living as christians -------------------------- */}
      <MeetingSection
        part={t('tr_livingPart')}
        color="var(--living-as-christians)"
        icon={<IconLivingPart color="var(--always-white)" />}
        expanded={openLC}
        onToggle={handleToggleLC}
      >
        {/* --- lc_part1 --- */}
        <>
          <Box
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              display: 'flex',
              gap: '16px',
            }}
          >
            <Typography
              className="h4"
              color={'var(--living-as-christians)'}
              width={`${196}px`}
            >
              {t('tr_lcPartNum', { partNumber: '1' })}
            </Typography>
            {selectedWeeks.map((value, index) => {
              return !lcNoAssignParts1[index] ? (
                <PersonSelector
                  week={value}
                  key={`lc-part1-${index}`}
                  notShowIcon
                  label={t('tr_conductor')}
                  type={AssignmentCode.MM_LCPart}
                  assignment="MM_LCPart1"
                  readOnly={false}
                />
              ) : (
                <Box flex={1} />
              );
            })}
          </Box>
          <Divider color="var(--grey-200)" />
        </>
        {/* --- lc_part2 --- */}
        {lcCount.some((lcRecordCount) => lcRecordCount > 1) && (
          <>
            <Box
              sx={{
                flexDirection: 'row',
                alignItems: 'center',
                display: 'flex',
                gap: '16px',
              }}
            >
              <Typography
                className="h4"
                color={'var(--living-as-christians)'}
                width={`${196}px`}
              >
                {t('tr_lcPartNum', { partNumber: '2' })}
              </Typography>
              {selectedWeeks.map((value, index) => {
                return lcCount[index] > 1 && !lcNoAssignParts2[index] ? (
                  <PersonSelector
                    week={value}
                    key={`lc-part2-${index}`}
                    notShowIcon
                    label={t('tr_conductor')}
                    type={AssignmentCode.MM_LCPart}
                    assignment="MM_LCPart2"
                    readOnly={false}
                  />
                ) : (
                  <Box flex={1} />
                );
              })}
            </Box>
            <Divider color="var(--grey-200)" />
          </>
        )}
        {/* --- lc_part3 --- */}
        {hasCustomPart.some((customPart) => customPart) && (
          <>
            <Box
              sx={{
                flexDirection: 'row',
                alignItems: 'center',
                display: 'flex',
                gap: '16px',
              }}
            >
              <Typography
                className="h4"
                color={'var(--living-as-christians)'}
                width={`${196}px`}
              >
                {t('tr_lcPartNum', { partNumber: '2' })}
              </Typography>
              {selectedWeeks.map((value, index) => {
                return lcCount[index] > 1 && !lcNoAssignParts3[index] ? (
                  <PersonSelector
                    week={value}
                    key={`lc-part3-${index}`}
                    notShowIcon
                    label={t('tr_conductor')}
                    type={AssignmentCode.MM_LCPart}
                    assignment="MM_LCPart3"
                    readOnly={false}
                  />
                ) : (
                  <Box flex={1} />
                );
              })}
            </Box>
            <Divider color="var(--grey-200)" />
          </>
        )}
        {/* --- lc_cbs --- */}
        <>
          <Box
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              display: 'flex',
              gap: '16px',
            }}
          >
            <Typography
              className="h4"
              color={'var(--living-as-christians)'}
              width={`${196}px`}
            >
              {t('tr_cbs')}
            </Typography>
            {selectedWeeks.map((value, index) => {
              return weeksTypes[index].value != Week.CO_VISIT ? (
                <Box
                  flex={1}
                  key={`lc-cbs-${index}`}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <PersonSelector
                    week={value}
                    label={t('tr_cbsConductor')}
                    type={AssignmentCode.MM_CBSConductor}
                    assignment="MM_LCCBSConductor"
                    readOnly={false}
                    notShowIcon
                  />
                  <PersonSelector
                    week={value}
                    label={t('tr_cbsReader')}
                    type={AssignmentCode.MM_CBSReader}
                    assignment="MM_LCCBSReader"
                    readOnly={false}
                    notShowIcon
                  />
                </Box>
              ) : (
                <Box flex={1} />
              );
            })}
          </Box>
          <Divider color="var(--grey-200)" />
        </>
        {!closingPrayerAuto && (
          <Box
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              display: 'flex',
              gap: '16px',
            }}
          >
            <Typography
              className="h4"
              color={'var(--living-as-christians)'}
              width={`${196}px`}
            >
              {t('tr_closingPrayer')}
            </Typography>
            {selectedWeeks.map((value, index) => {
              return (
                <PersonSelector
                  key={`closing-prayer-${index}`}
                  week={value}
                  notShowIcon
                  label={t('tr_prayer')}
                  type={AssignmentCode.MM_Prayer}
                  assignment="MM_ClosingPrayer"
                  readOnly={false}
                />
              );
            })}
          </Box>
        )}
      </MeetingSection>
    </Box>
  );
};

export default MonthlyView;
