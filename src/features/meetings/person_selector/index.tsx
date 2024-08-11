import { Box, FormControlLabel, Popper, RadioGroup } from '@mui/material';
import { PersonOptionsType, PersonSelectorType } from './index.types';
import { IconAssignmetHistory, IconFemale, IconMale } from '@components/icons';
import { AssignmentCode } from '@definition/assignment';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import usePersonSelector from './usePersonSelector';
import AssignmentsHistoryDialog from '../assignments_history_dialog';
import AutoComplete from '@components/autocomplete';
import IconButton from '@components/icon_button';
import Radio from '@components/radio';
import Typography from '@components/typography';

const PersonSelector = (props: PersonSelectorType) => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const {
    options,
    getPersonDisplayName,
    optionHeader,
    value,
    handleSaveAssignment,
    showGenderSelector,
    gender,
    handleGenderUpdate,
    isAssistant,
    type,
    handleOpenHistory,
    handleCloseHistory,
    isHistoryOpen,
    assignmentsHistory,
    placeHolderIcon,
    helperText,
    visitingSpeaker,
    freeSolo,
    freeSoloText,
    handleFreeSoloTextChange,
    decorator,
    schedule_id,
  } = usePersonSelector(props);

  return (
    <Box>
      {isHistoryOpen && !freeSolo && (
        <AssignmentsHistoryDialog
          open={isHistoryOpen}
          onClose={handleCloseHistory}
          person={getPersonDisplayName(value as PersonOptionsType)}
          history={assignmentsHistory}
        />
      )}

      <AutoComplete
        readOnly={props.readOnly}
        freeSolo={freeSolo}
        label={props.label}
        isOptionEqualToValue={(option, value) =>
          option.person_uid === value.person_uid
        }
        getOptionLabel={(option: PersonOptionsType) =>
          getPersonDisplayName(option)
        }
        options={options}
        fullWidth={true}
        inputValue={freeSoloText}
        value={
          freeSolo
            ? value
            : options.find(
                  (record) =>
                    typeof value !== 'string' &&
                    record.person_uid === value?.person_uid
                )
              ? value
              : null
        }
        onChange={(_, value: PersonOptionsType) => handleSaveAssignment(value)}
        onInputChange={(_, value) => handleFreeSoloTextChange(value)}
        PopperComponent={(props) => (
          <Popper
            {...props}
            style={{ minWidth: 320 }}
            placement="bottom-start"
          />
        )}
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            sx={{
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: 'space-between',
              padding: '8px 10px 0 0',
            }}
            key={option.person_uid}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: visitingSpeaker ? '100%' : '200px',
              }}
            >
              {option.person_data.male.value ? <IconMale /> : <IconFemale />}
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
              >
                <Typography className="body-regular">
                  {getPersonDisplayName(option)}
                </Typography>
                {showGenderSelector &&
                  option.last_assistant.length > 0 &&
                  option.last_assistant !== option.last_assignment && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Typography
                        className="body-small-regular"
                        color="var(--grey-350)"
                      >
                        {t('tr_assistant')}:
                      </Typography>
                      <Typography
                        className="body-small-regular"
                        color="var(--grey-350)"
                      >
                        {option.last_assistant}
                      </Typography>
                    </Box>
                  )}
              </Box>
            </Box>

            {!freeSolo && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Typography
                  className="body-small-regular"
                  color="var(--grey-350)"
                  align="center"
                  sx={{ width: '85px' }}
                >
                  {option.last_assignment}
                </Typography>
                {(showGenderSelector ||
                  type === AssignmentCode.MM_BibleReading) && (
                  <Typography
                    className="body-small-regular"
                    color="var(--grey-350)"
                    align="center"
                    sx={{ width: '70px' }}
                  >
                    {option.hall}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}
        optionsHeader={
          <>
            <Typography className="h3" sx={{ padding: '8px 0px' }}>
              {optionHeader}
            </Typography>

            {showGenderSelector && !isAssistant && (
              <RadioGroup
                sx={{
                  flexDirection: 'row',
                  gap: '16px',
                  padding: '0px 0 8px 8px',
                }}
                value={gender}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label={<Typography>{t('tr_male')}</Typography>}
                  onClick={(e) => handleGenderUpdate(e, 'male')}
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label={<Typography>{t('tr_female')}</Typography>}
                  onClick={(e) => handleGenderUpdate(e, 'female')}
                />
              </RadioGroup>
            )}

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'space-between',
                padding: '8px 10px 0 0',
              }}
            >
              <Typography
                className="body-small-regular"
                color="var(--grey-350)"
                sx={{ width: '200px' }}
              >
                {t('tr_name')}
              </Typography>

              {!visitingSpeaker && !schedule_id && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Typography
                    className="body-small-regular"
                    color="var(--grey-350)"
                    align="center"
                    sx={{ width: '85px' }}
                  >
                    {t('tr_lastAssignment')}
                  </Typography>
                  {(showGenderSelector ||
                    type === AssignmentCode.MM_BibleReading) && (
                    <Typography
                      className="body-small-regular"
                      color="var(--grey-350)"
                      align="center"
                      sx={{ width: '70px' }}
                    >
                      {t('tr_hall')}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </>
        }
        styleIcon={false}
        startIcon={
          value && typeof value !== 'string' ? (
            value.person_data.male.value ? (
              <IconMale />
            ) : (
              <IconFemale />
            )
          ) : (
            placeHolderIcon
          )
        }
        endIcon={
          value && !freeSolo ? (
            <>
              <IconButton
                sx={{ padding: 0 }}
                onClick={handleOpenHistory}
                tooltip={t('tr_assignmentHistory')}
              >
                <IconAssignmetHistory
                  color={
                    helperText.length > 0
                      ? 'var(--orange-dark)'
                      : 'var(--accent-main)'
                  }
                />
              </IconButton>
            </>
          ) : null
        }
        decorator={decorator}
      />

      {helperText.length > 0 && (
        <Typography
          className="label-small-regular"
          color="var(--orange-dark)"
          sx={{
            padding: '4px 16px 0 16px',
            maxWidth: desktopUp ? '350px' : '100%',
          }}
        >
          {helperText}
        </Typography>
      )}

      {visitingSpeaker && typeof value === 'string' && props.helperNode}
    </Box>
  );
};

export default PersonSelector;
