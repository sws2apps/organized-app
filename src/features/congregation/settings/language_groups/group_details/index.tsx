import { Box, SelectChangeEvent } from '@mui/material';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import { LanguageGroupDetailsProps } from './index.types';
import SourceLanguageSelector from '@components/source_language_selector';
import TextField from '@components/textfield';

const LanguageGroupDetails = ({
  circuit,
  language,
  name,
  onCircuitChange,
  onLanguageChange,
  onNameChange,
  layout = 'row',
}: LanguageGroupDetailsProps) => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const { isAdmin } = useCurrentUser();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: laptopUp
          ? layout === 'popup'
            ? '1fr 1fr'
            : 'repeat(3, 1fr)'
          : '1fr',
        gap: '16px',
      }}
    >
      <TextField
        label={t('tr_groupNameLabel')}
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        sx={{
          gridColumn: laptopUp && layout === 'popup' ? '1 / -1' : 'auto',
        }}
      />

      <TextField
        label={t('tr_circuitNumber')}
        value={circuit}
        onChange={(e) => onCircuitChange(e.target.value)}
      />

      <SourceLanguageSelector
        readOnly={!isAdmin}
        label={t('tr_groupLanguage')}
        value={language}
        onChange={(e: SelectChangeEvent<string>) =>
          onLanguageChange(e.target.value)
        }
      />
    </Box>
  );
};

export default LanguageGroupDetails;
