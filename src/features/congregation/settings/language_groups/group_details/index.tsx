import { SelectChangeEvent } from '@mui/material';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import { LanguageGroupDetailsProps } from './index.types';
import { DetailsGrid } from './index.styles';
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

  const { desktopUp } = useBreakpoints();

  const { isAdmin } = useCurrentUser();

  return (
    <DetailsGrid $layout={layout}>
      <TextField
        label={t('tr_groupNameLabel')}
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        sx={{
          gridColumn: desktopUp && layout === 'popup' ? '1 / -1' : 'auto',
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
    </DetailsGrid>
  );
};

export default LanguageGroupDetails;
