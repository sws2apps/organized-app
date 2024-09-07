import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useBibleStudies from './useBibleStudies';
import Typography from '@components/typography';
import MiniChip from '@components/mini_chip';

const BibleStudies = () => {
  const { t } = useAppTranslation();

  const { bible_studies, bible_studies_names } = useBibleStudies();

  return (
    <Stack spacing="8px">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <Typography>{t('tr_individualBibleStudies')}</Typography>

        <Typography
          className="h3"
          color={bible_studies === 0 ? 'var(--accent-350)' : 'var(--black)'}
        >
          {bible_studies}
        </Typography>
      </Box>

      <Box
        sx={{ width: '100%', display: 'flex', gap: '4px', flexWrap: 'wrap' }}
      >
        {bible_studies_names.map((record) => (
          <MiniChip key={record} label={record} />
        ))}
      </Box>
    </Stack>
  );
};

export default BibleStudies;
