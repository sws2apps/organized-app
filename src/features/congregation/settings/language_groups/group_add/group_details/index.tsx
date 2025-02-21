import { Box, SelectChangeEvent, Stack } from '@mui/material';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import { GroupDetailsProps } from './index.types';
import useGroupDetails from './useGroupDetails';
import Button from '@components/button';
import SourceLanguageSelector from '@components/source_language_selector';
import TextField from '@components/textfield';
import Typography from '@components/typography';

const GroupDetails = (props: GroupDetailsProps) => {
  const { t } = useAppTranslation();

  const { tabletUp } = useBreakpoints();

  const { isAdmin } = useCurrentUser();

  const {
    handleNameChange,
    name,
    handleLanguageChange,
    language,
    circuit,
    handleCircuitChange,
  } = useGroupDetails(props);

  return (
    <Stack spacing="24px" width="100%">
      <Stack spacing="16px">
        <Typography className="h2">{t('tr_addNewLangGroup')}</Typography>
        <Typography color="var(--grey-400)">
          {t('tr_addNewLangGroupDesc')}
        </Typography>
      </Stack>

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
            onChange={(e) => handleNameChange(e.target.value)}
            sx={{ flex: 1 }}
          />

          <TextField
            label={t('tr_circuitNumber')}
            value={circuit}
            onChange={(e) => handleCircuitChange(e.target.value)}
            sx={{ flex: tabletUp ? 0.6 : 1 }}
          />
        </Box>

        <SourceLanguageSelector
          readOnly={!isAdmin}
          label={t('tr_groupLanguage')}
          value={language}
          onChange={(e: SelectChangeEvent<string>) =>
            handleLanguageChange(e.target.value)
          }
        />
      </Stack>

      <Stack spacing="8px">
        <Button variant="main">{t('tr_next')}</Button>
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_cancel')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default GroupDetails;
