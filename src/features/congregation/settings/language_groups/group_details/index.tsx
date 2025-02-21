import { Box, SelectChangeEvent, Stack } from '@mui/material';
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
}: LanguageGroupDetailsProps) => {
  const { t } = useAppTranslation();

  const { tabletUp } = useBreakpoints();

  const { isAdmin } = useCurrentUser();

  return (
    <Stack spacing="16px">
      <Box
        sx={{
          display: 'flex',
          flexDirection: tabletUp ? 'row' : 'column',
          gap: tabletUp ? '8px' : '16px',
        }}
      >
        <TextField
          label={t('tr_groupNameLabel')}
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          sx={{ flex: 1 }}
        />

        <TextField
          label={t('tr_circuitNumber')}
          value={circuit}
          onChange={(e) => onCircuitChange(e.target.value)}
          sx={{ flex: tabletUp ? 0.6 : 1 }}
        />
      </Box>

      <SourceLanguageSelector
        readOnly={!isAdmin}
        label={t('tr_groupLanguage')}
        value={language}
        onChange={(e: SelectChangeEvent<string>) =>
          onLanguageChange(e.target.value)
        }
      />
    </Stack>
  );
};

export default LanguageGroupDetails;
