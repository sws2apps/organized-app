import { Box, ListItemText } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { SourceLanguageProps } from './index.types';
import useCurrentUser from '@hooks/useCurrentUser';
import useSourceLanguage from './useSourceLanguage';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';

const SourceLanguage = ({ label }: SourceLanguageProps) => {
  const { t } = useAppTranslation();

  const { isMidweekEditor, isWeekendEditor, isPublicTalkCoordinator } =
    useCurrentUser();

  const { SOURCE_LANGUAGES, value, handleChangeLanguage, value_fullname } =
    useSourceLanguage();

  return (
    <Select
      readOnly={
        !isMidweekEditor && !isWeekendEditor && !isPublicTalkCoordinator
      }
      label={label || t('tr_changeLanguage')}
      value={value}
      onChange={(e) => handleChangeLanguage(String(e.target.value))}
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

export default SourceLanguage;
