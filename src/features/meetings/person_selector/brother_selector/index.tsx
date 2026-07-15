import { Box, Popper } from '@mui/material';
import { PersonOptionsType, PersonSelectorType } from '../index.types';
import {
  IconAssignmetHistory,
  IconClose,
  IconEdit,
  IconMale,
} from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useBrotherSelector from './useBrotherSelector';
import AutoComplete from '@components/autocomplete';
import AssignmentsHistoryDialog from '@features/meetings/assignments_history_dialog';
import IconButton from '@components/icon_button';
import Typography from '@components/typography';

const BrotherSelector = (props: PersonSelectorType) => {
  const showIcon = props.showIcon ?? true;
  const showAssignmentsHistory = props.showAssignmentsHistory ?? true;

  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const {
    options,
    handleSaveAssignment,
    value,
    helperText,
    helperSeverity,
    isDutiesField,
    handleCloseHistory,
    handleOpenHistory,
    isHistoryOpen,
    personHistory,
    isFreeSolo,
    inputValue,
    handleValueChange,
    isLinkedPart,
  } = useBrotherSelector(props);

  const helperColor =
    helperSeverity === 'error' ? 'var(--red-main)' : 'var(--orange-dark)';

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
        endIcon={props.endIcon}
        inputValue={inputValue}
        onInputChange={(_, value) => handleValueChange(value)}
        onChange={(_, value: PersonOptionsType) => handleSaveAssignment(value)}
        fullWidth={true}
        groupBy={
          isDutiesField
            ? (option: PersonOptionsType) =>
                option.conflict?.length > 0 ? 'conflict' : 'free'
            : undefined
        }
        renderGroup={
          isDutiesField
            ? (params) => (
                <li key={params.key}>
                  <Typography
                    className="body-small-semibold"
                    color="var(--accent-main)"
                    sx={{ padding: '8px 12px 4px 16px' }}
                  >
                    {params.group === 'free'
                      ? t('tr_noOtherAssignments')
                      : t('tr_withOtherAssignments')}
                  </Typography>
                  <ul style={{ padding: 0, margin: 0 }}>{params.children}</ul>
                </li>
              )
            : undefined
        }
        slots={{
          popper(props) {
            return (
              <Popper
                {...props}
                style={{ minWidth: 320 }}
                placement="bottom-start"
              />
            );
          },
        }}
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

              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
              >
                <Typography className="body-regular">
                  {option.person_name}
                </Typography>

                {option.conflict?.length > 0 && (
                  <Typography
                    className="label-small-regular"
                    color="var(--grey-350)"
                  >
                    {option.conflict}
                  </Typography>
                )}
              </Box>
            </Box>

            {!isDutiesField && (
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
            )}
          </Box>
        )}
        optionsHeader={
          isDutiesField ? null : (
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

                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
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
          )
        }
        styleIcon={false}
        startIcon={showIcon ? <IconMale /> : null}
        decorator={
          helperText.length > 0 && !isLinkedPart
            ? helperSeverity === 'error'
              ? 'error'
              : true
            : false
        }
        clearIcon={<IconClose width={20} height={20} />}
        sx={{
          // only nudge the resting label; the floated (shrunk) label keeps
          // the standard notched position
          '& .MuiInputLabel-root[data-shrink=false]': {
            top: '-5px !important',
          },

          '& .MuiOutlinedInput-root': {
            height: '48px !important',
          },
          '& .MuiOutlinedInput-input': {
            paddingRight: props.endIcon ? '10px !important' : '80px !important',
          },
          '& .MuiAutocomplete-clearIndicator': {
            marginRight: value ? '30px' : 'initial',
          },
        }}
      />

      {showAssignmentsHistory && value && (
        <IconButton
          sx={{ padding: 0, position: 'absolute', right: 35, top: 10 }}
          title={t('tr_assignmentHistory')}
          onClick={handleOpenHistory}
        >
          <IconAssignmetHistory
            color={helperText.length > 0 ? helperColor : 'var(--accent-main)'}
          />
        </IconButton>
      )}

      {props.onEditClick && (
        <IconButton
          sx={{ padding: 0, position: 'absolute', right: 35, top: 12 }}
          onClick={props.onEditClick}
        >
          <IconEdit
            color={helperText.length > 0 ? helperColor : 'var(--accent-main)'}
          />
        </IconButton>
      )}

      {helperText.length > 0 && (
        <Typography
          className="label-small-regular"
          color={isLinkedPart ? 'var(--grey-350)' : helperColor}
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
