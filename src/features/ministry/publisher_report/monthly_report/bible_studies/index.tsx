import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useBibleStudies from './useBibleStudies';
import Typography from '@components/typography';
import BibleStudiesEditor from '@features/ministry/bible_studies_editor';

const BibleStudies = () => {
  const { t } = useAppTranslation();

  const { value } = useBibleStudies();

  return (
    <Stack spacing="8px">
      <Stack
        spacing="8px"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography>{t('tr_bibleStudies')}</Typography>
        <BibleStudiesEditor value={value} />
      </Stack>
    </Stack>
  );
};

export default BibleStudies;
