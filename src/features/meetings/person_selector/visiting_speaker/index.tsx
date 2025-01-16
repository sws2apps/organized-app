import { Box, Popper } from '@mui/material';
import { PersonOptionsType, PersonSelectorType } from '../index.types';
import { IconClose, IconMale } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useVisitingSpeaker from './useVisitingSpeaker';
import AutoComplete from '@components/autocomplete';
import Typography from '@components/typography';

const VisitingSpeaker = (props: PersonSelectorType) => {
  const showIcon = props.showIcon ?? true;

  const { t } = useAppTranslation();

  const {
    options,
    handleSaveAssignment,
    value,
    handleValueChange,
    handleValueSave,
    inputValue,
  } = useVisitingSpeaker(props);

  return (
    <>
      <AutoComplete
        freeSolo={true}
        label={props.label}
        isOptionEqualToValue={(option, value) =>
          option.person_uid === value.person_uid
        }
        getOptionLabel={(option: PersonOptionsType) => option.person_name}
        options={options}
        value={value}
        inputValue={inputValue}
        onInputChange={(_, value) => handleValueChange(value)}
        onKeyUp={handleValueSave}
        onChange={(_, value: PersonOptionsType) => handleSaveAssignment(value)}
        fullWidth={true}
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
                width: '100%',
              }}
            >
              {showIcon && <IconMale />}

              <Typography>{option.person_name}</Typography>
            </Box>
          </Box>
        )}
        optionsHeader={
          <>
            <Typography className="h3" sx={{ padding: '8px 0px' }}>
              {t('tr_brothers')}
            </Typography>

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
            </Box>
          </>
        }
        styleIcon={false}
        startIcon={showIcon ? <IconMale /> : null}
        clearIcon={<IconClose width={20} height={20} />}
      />

      {inputValue.length > 0 && !value && props.helperNode}
    </>
  );
};

export default VisitingSpeaker;
