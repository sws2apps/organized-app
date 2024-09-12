import { FormControlLabel, RadioGroup, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { AllRecordsProps } from './index.types';
import { ExportType } from '../index.types';
import Button from '@components/button';
import Radio from '@components/radio';
import Typography from '@components/typography';

const AllRecords = ({
  action,
  onClose,
  onTypeChange,
  type,
}: AllRecordsProps) => {
  const { t } = useAppTranslation();

  return (
    <>
      <Stack spacing="16px">
        <Typography className="h2">{t('tr_S21CardTitle')}</Typography>

        <Typography color="var(--grey-400)">
          {t('tr_S21CardTitleDesc')}
        </Typography>
      </Stack>

      <RadioGroup
        value={type}
        onChange={(e) => onTypeChange(e.target.value as ExportType)}
        sx={{ gap: '8px', marginLeft: '6px' }}
      >
        <FormControlLabel
          value="all"
          label={<Typography>{t('tr_allPublisherRecords')}</Typography>}
          control={<Radio />}
        />
        <FormControlLabel
          value="select"
          label={<Typography>{t('tr_specificPublisherRecords')}</Typography>}
          control={<Radio />}
        />
      </RadioGroup>

      <Stack spacing="8px" width="100%">
        <Button variant="main" onClick={action}>
          {type === 'all' ? t('tr_export') : t('tr_next')}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </Stack>
    </>
  );
};

export default AllRecords;
