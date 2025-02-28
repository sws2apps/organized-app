import { Box, InputAdornment, SelectChangeEvent } from '@mui/material';
import { IconJwHome, IconLanguageGroup } from '@components/icons';
import { useBreakpoints } from '@hooks/index';
import useGroupLanguageSelector from './useLanguageGroupSelector';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';

const LanguageGroupSelector = () => {
  const { tablet688Up } = useBreakpoints();

  const { ref, display, options, value, renderValue, handleChange } =
    useGroupLanguageSelector();

  if (!display) return <></>;

  return (
    <Box ref={ref} width={tablet688Up ? 'unset' : '100%'}>
      <Select
        value={value}
        onChange={(e: SelectChangeEvent<string>) =>
          handleChange(e.target.value)
        }
        renderValue={(value: string) => renderValue(value)}
        sx={{
          '&.MuiInputBase-root': {
            backgroundColor: 'var(--white)',
            borderRadius: 'var(--radius-max)',
          },
          width: tablet688Up ? '250px' : '100%',
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
          <MenuItem key={option.value} value={option.value} sx={{ gap: '8px' }}>
            {option.icon === 'main' && (
              <IconJwHome color="var(--accent-dark)" />
            )}

            {option.icon === 'group' && (
              <IconLanguageGroup color="var(--accent-dark)" />
            )}

            <Typography>{option.label}</Typography>
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default LanguageGroupSelector;
