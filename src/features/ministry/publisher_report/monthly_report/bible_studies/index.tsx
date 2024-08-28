import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import Typography from '@components/typography';

const BibleStudies = () => {
  const { t } = useAppTranslation();

  return (
    <Stack spacing="8px">
      <Stack
        spacing="8px"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography>{t('tr_bibleStudies')}</Typography>
        <Typography className="h2">0</Typography>
      </Stack>
    </Stack>
  );
};

export default BibleStudies;
