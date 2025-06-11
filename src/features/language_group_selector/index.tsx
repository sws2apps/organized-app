import { Box, InputAdornment, SelectChangeEvent } from '@mui/material';
import { IconCheck, IconJwHome, IconLanguageGroup } from '@components/icons';
import { useBreakpoints } from '@hooks/index';
import useGroupLanguageSelector from './useLanguageGroupSelector';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';

const LanguageGroupSelector = () => {
  const { tablet688Up } = useBreakpoints();

  const { display, options, value, renderValue, handleChange } =
    useGroupLanguageSelector();

  if (!display) return <></>;

  return (
    <Box width={tablet688Up ? 'unset' : '100%'}>
      <Select
        value={value}
        onChange={(e: SelectChangeEvent<string>) =>
          handleChange(e.target.value)
        }
        renderValue={(value: string) => renderValue(value)}
        sx={{
          width: tablet688Up ? '250px' : '100%',
          '&.MuiInputBase-root': {
            backgroundColor: 'var(--white)',
            borderRadius: 'var(--radius-max)',
            '& > .MuiSelect-select': {
              color: 'var(--accent-dark)',
            },
            '& > .MuiSelect-icon': {
              color: 'var(--accent-dark)',
            },
          },
        }}
        slotProps={{
          notchedOutline: {
            className: 'big-card-shadow',
            sx: {
              borderRadius: 'var(--radius-max) !important',
              borderColor: 'var(--accent-200) !important',
            },
          },
          root: {},
        }}
        startAdornment={
          <InputAdornment position="start">
            {value === 'main' && <IconJwHome color="var(--accent-dark)" />}

            {value !== 'main' && (
              <IconLanguageGroup color="var(--accent-dark)" />
            )}
          </InputAdornment>
        }
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              gap: '8px',
              '&.Mui-selected p': {
                color: 'var(--accent-dark)',
              },
            }}
          >
            {option.icon === 'main' && (
              <IconJwHome
                color={
                  option.value === value
                    ? 'var(--accent-dark)'
                    : 'var(--grey-400)'
                }
              />
            )}

            {option.icon === 'group' && (
              <IconLanguageGroup
                color={
                  option.value === value
                    ? 'var(--accent-dark)'
                    : 'var(--grey-400)'
                }
              />
            )}

            <Typography color="var(--grey-400)">{option.label}</Typography>

            {option.value === value && <IconCheck color="var(--accent-dark)" />}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default LanguageGroupSelector;
