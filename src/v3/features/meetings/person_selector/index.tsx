import { Box, FormControlLabel, IconButton, Popper, RadioGroup } from '@mui/material';
import { PersonOptionsType, PersonSelectorType } from './index.types';
import { IconAssignmetHistory, IconFemale, IconMale } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import usePersonSelector from './usePersonSelector';
import AutoComplete from '@components/autocomplete';
import Radio from '@components/radio';
import Typography from '@components/typography';

const PersonSelector = (props: PersonSelectorType) => {
  const { t } = useAppTranslation();

  const { tabletUp } = useBreakpoints();

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
  } = usePersonSelector(props);

  return (
    <AutoComplete
      label={props.label}
      isOptionEqualToValue={(option, value) => option.person_uid === value.person_uid}
      getOptionLabel={(option: PersonOptionsType) => getPersonDisplayName(option)}
      options={options}
      fullWidth={true}
      value={options.find((record) => record.person_uid === value?.person_uid) ? value : null}
      onChange={(_, value: PersonOptionsType) => handleSaveAssignment(value)}
      PopperComponent={(props) => <Popper {...props} style={{ minWidth: 320 }} placement="bottom-start" />}
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          sx={{
            margin: 0,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            justifyContent: 'space-between',
            paddingTop: '8px',
          }}
          key={option.person_uid}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', width: '222px' }}>
            {option.person_data.male.value ? <IconMale /> : <IconFemale />}
            <Typography className="body-regular">{getPersonDisplayName(option)}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Typography className="body-small-regular" color="var(--grey-350)" sx={{ width: '110px' }}>
              {option.last_assignment}
            </Typography>
            {tabletUp && showGenderSelector && (
              <Typography className="body-small-regular" color="var(--grey-350)" sx={{ width: '110px' }}>
                {option.last_assistant}
              </Typography>
            )}
          </Box>
        </Box>
      )}
      optionsHeader={
        <>
          <Typography className="h3" sx={{ padding: '8px 0px' }}>
            {optionHeader}
          </Typography>
          {showGenderSelector && !isAssistant && (
            <RadioGroup sx={{ flexDirection: 'row', gap: '16px', padding: '0px 0 8px 8px' }} value={gender}>
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
              paddingTop: '8px',
            }}
          >
            <Typography className="body-small-regular" color="var(--grey-350)" sx={{ width: '222px' }}>
              {t('tr_name')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Typography className="body-small-regular" color="var(--grey-350)" sx={{ width: '130px' }}>
                {t('tr_lastAssignment')}
              </Typography>
              {tabletUp && showGenderSelector && (
                <Typography className="body-small-regular" color="var(--grey-350)" sx={{ width: '130px' }}>
                  {t('tr_assistant')}
                </Typography>
              )}
            </Box>
          </Box>
        </>
      }
      styleIcon={false}
      startIcon={value ? value.person_data.male.value ? <IconMale /> : <IconFemale /> : null}
      endIcon={
        value ? (
          <IconButton sx={{ padding: 0 }}>
            <IconAssignmetHistory color="var(--accent-main)" />
          </IconButton>
        ) : null
      }
    />
  );
};

export default PersonSelector;
