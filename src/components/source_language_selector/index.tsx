import { SelectPropsType } from '@components/select/index.types';
import useSourceLanguageSelector from './useSourceLanguageSelector';
import Select from '@components/select';
import Typography from '@components/typography';
import MenuItem from '@components/menuitem';
import { Box, ListItemText } from '@mui/material';

const SourceLanguageSelector = (props: SelectPropsType) => {
  const { SOURCE_LANGUAGES, value_fullname } = useSourceLanguageSelector(props);

  return (
    <Select
      {...props}
      renderValue={() => <Typography>{value_fullname}</Typography>}
    >
      {SOURCE_LANGUAGES.map((language) => (
        <MenuItem key={language.code} value={language.code.toUpperCase()}>
          <ListItemText>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Typography
                className="label-small-medium"
                color="var(--accent-dark)"
                sx={{
                  backgroundColor: 'var(--accent-200)',
                  padding: '2px 3px',
                  borderRadius: 'var(--radius-s)',
                }}
              >
                {language.code.toUpperCase()}
              </Typography>
              <Typography className="body-regular" color="var(--black)">
                {language.name}
              </Typography>
            </Box>
          </ListItemText>
        </MenuItem>
      ))}
    </Select>
  );
};

export default SourceLanguageSelector;
