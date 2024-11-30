import { Box, Popper } from '@mui/material';
import { PersonOptionsType, PersonSelectorType } from '../index.types';
import { IconAssignmetHistory, IconClose, IconMale } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useBrotherSelector from './useBrotherSelector';
import AutoComplete from '@components/autocomplete';
import AssignmentsHistoryDialog from '@features/meetings/assignments_history_dialog';
import IconButton from '@components/icon_button';
import Typography from '@components/typography';

const BrotherSelector = (props: PersonSelectorType) => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const {
    options,
    handleSaveAssignment,
    value,
    helperText,
    handleCloseHistory,
    handleOpenHistory,
    isHistoryOpen,
    personHistory,
    isFreeSolo,
    inputValue,
    handleValueChange,
  } = useBrotherSelector(props);

  return (
    <Box sx={{ position: 'relative' }}>
      {isHistoryOpen && (
        <AssignmentsHistoryDialog
          open={isHistoryOpen}
          onClose={handleCloseHistory}
          person={value.person_name}
          history={personHistory}
        />
      )}

      <AutoComplete
        freeSolo={isFreeSolo}
        readOnly={props.readOnly}
        label={props.label}
        isOptionEqualToValue={(option, value) =>
          option.person_uid === value.person_uid
        }
        getOptionLabel={(option: PersonOptionsType) => option.person_name}
        options={options}
        value={value}
        inputValue={inputValue}
        onInputChange={(_, value) => handleValueChange(value)}
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
              <IconMale />

              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
              >
                <Typography className="body-regular">
                  {option.person_name}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Typography
                className="body-small-regular"
                color="var(--grey-350)"
                align="center"
                sx={{ width: '85px' }}
              >
                {option.last_assignment}
              </Typography>
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

              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Typography
                  className="body-small-regular"
                  color="var(--grey-350)"
                  align="center"
                  sx={{ width: '85px' }}
                >
                  {t('tr_lastAssignment')}
                </Typography>
              </Box>
            </Box>
          </>
        }
        styleIcon={false}
        startIcon={<IconMale />}
        decorator={helperText.length > 0}
        clearIcon={<IconClose width={20} height={20} />}
        sx={{
          '& .MuiOutlinedInput-input': {
            paddingRight: '80px !important',
          },
          '& .MuiAutocomplete-clearIndicator': {
            marginRight: value ? '30px' : 'initial',
          },
        }}
      />

      {value && (
        <IconButton
          sx={{ padding: 0, position: 'absolute', right: 35, top: 12 }}
          title={t('tr_assignmentHistory')}
          onClick={handleOpenHistory}
        >
          <IconAssignmetHistory
            color={
              helperText.length > 0
                ? 'var(--orange-dark)'
                : 'var(--accent-main)'
            }
          />
        </IconButton>
      )}

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
    </Box>
  );
};

export default BrotherSelector;
