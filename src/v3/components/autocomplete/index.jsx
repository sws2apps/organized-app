import PropTypes from 'prop-types';
import { Autocomplete, Box, Paper } from '@mui/material';
import { TextField, Typography } from '@components';
import { useAppTranslation } from '@hooks/index';

const CustomPaper = (props) => {
  return (
    <Paper
      {...props}
      elevation={1}
      sx={{
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-l)',
        border: '1px solid var(--accent-200)',
      }}
      className="small-card-shadow"
    />
  );
};

const CustomListBoxComponent = (props) => {
  return (
    <Box
      {...props}
      component="ul"
      sx={{
        padding: '8px 0px',
        '& .MuiAutocomplete-option': {
          padding: '8px 12px 8px 16px !important',
          minHeight: '36px !important',
          backgroundColor: 'unset',
          borderBottom: '1px solid var(--accent-200)',
          '&:hover': {
            backgroundColor: 'var(--accent-100)',
            '& p': {
              color: 'var(--accent-dark)',
            },
          },
        },
        '& .MuiAutocomplete-option:last-child': {
          borderBottom: 'none',
        },
      }}
    />
  );
};

const CPEAutoComplete = ({
  open,
  onOpen,
  onClose,
  options,
  loading = true,
  value,
  onChange,
  label,
  startIcon = null,
  endIcon = null,
  isOptionEqualToValue,
  getOptionLabel,
  autoComplete = false,
  includeInputInList = false,
  onInputChange,
  renderOption,
}) => {
  const { t } = useAppTranslation();

  return (
    <Autocomplete
      fullWidth={true}
      sx={{
        '.MuiOutlinedInput-root': {
          padding: '0px 14px',
        },
        '.MuiInputBase-adornedEnd': {
          paddingRight: '14px !important',
        },
        '.MuiAutocomplete-input': {
          padding: '0px !important',
        },
      }}
      autoComplete={autoComplete}
      includeInputInList={includeInputInList}
      PaperComponent={CustomPaper}
      ListboxComponent={CustomListBoxComponent}
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      isOptionEqualToValue={isOptionEqualToValue}
      getOptionLabel={getOptionLabel}
      options={options}
      loading={loading}
      value={value}
      onChange={onChange}
      onInputChange={onInputChange}
      noOptionsText={
        <Box sx={{ backgroundColor: 'var(--white)' }}>
          <Typography variant="body-regular">{t('trans_noOptions')}</Typography>
        </Box>
      }
      loadingText={
        <Box sx={{ backgroundColor: 'var(--white)' }}>
          <Typography variant="body-regular">{t('trans_loading')}</Typography>
        </Box>
      }
      renderOption={renderOption}
      renderInput={(params) => (
        <TextField
          autoProps={params}
          label={label}
          InputProps={{ ...params.InputProps }}
          startIcon={startIcon}
          endIcon={endIcon}
          height={48}
        />
      )}
    />
  );
};

CPEAutoComplete.propTypes = {
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  onInputChange: PropTypes.func,
  renderOption: PropTypes.func,
  options: PropTypes.array,
  loading: PropTypes.bool,
  value: PropTypes.any,
  onChange: PropTypes.func,
  label: PropTypes.string,
  startIcon: PropTypes.element,
  endIcon: PropTypes.element,
  isOptionEqualToValue: PropTypes.func.isRequired,
  getOptionLabel: PropTypes.func.isRequired,
  autoComplete: PropTypes.bool,
  includeInputInList: PropTypes.bool,
};

export default CPEAutoComplete;
