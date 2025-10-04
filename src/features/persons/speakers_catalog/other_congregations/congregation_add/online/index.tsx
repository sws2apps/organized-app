import { Box } from '@mui/material';
import { IconSearch } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { CongregationOnlineAddType } from './index.types';
import { IncomingCongregationResponseType } from '@definition/api';
import useOnline from './useOnline';
import AutoComplete from '@components/autocomplete';
import Typography from '@components/typography';

const CongregationOnlineAdd = ({
  onCongregationChange,
}: CongregationOnlineAddType) => {
  const { t } = useAppTranslation();

  const { isLoading, options, setInputValue, setValue, value } = useOnline();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Typography color="var(--grey-400)">
        {t('tr_addOrganizedCongregationDesc')}
      </Typography>

      <AutoComplete
        isOptionEqualToValue={(option, value) =>
          option.cong_name === value.cong_name
        }
        getOptionLabel={(option: IncomingCongregationResponseType) =>
          option.cong_name
        }
        filterOptions={(x) => x}
        autoComplete={true}
        includeInputInList={true}
        options={options}
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            sx={{ margin: 0, padding: 0 }}
            key={option.cong_name}
          >
            <Typography>{option.cong_name}</Typography>
          </Box>
        )}
        loading={isLoading}
        value={value}
        onChange={(_, newValue: IncomingCongregationResponseType) => {
          setValue(newValue);
          onCongregationChange(newValue);
        }}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
        label={t('tr_searchCongregation')}
        endIcon={
          <IconSearch color={value ? 'var(--black)' : 'var(--accent-350)'} />
        }
      />
    </Box>
  );
};

export default CongregationOnlineAdd;
