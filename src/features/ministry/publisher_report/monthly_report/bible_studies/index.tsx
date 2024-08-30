import { Box, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useBibleStudies from './useBibleStudies';
import Typography from '@components/typography';
import BibleStudiesEditor from '@features/ministry/bible_studies_editor';
import MiniChip from '@components/mini_chip';

const BibleStudies = () => {
  const { t } = useAppTranslation();

  const { tabletUp } = useBreakpoints();

  const { value, handleValueChange, bibleStudiesValidator, namedRecords } =
    useBibleStudies();

  return (
    <Stack spacing="8px">
      <Box
        sx={{
          display: 'flex',
          alignItems: tabletUp ? 'center' : 'flex-start',
          justifyContent: 'space-between',
          gap: '8px',
          flexDirection: tabletUp ? 'row' : 'column',
        }}
      >
        <Typography>{t('tr_bibleStudies')}</Typography>
        <BibleStudiesEditor
          value={value}
          onChange={handleValueChange}
          validator={bibleStudiesValidator}
        />
      </Box>

      <Box
        sx={{ width: '100%', display: 'flex', gap: '4px', flexWrap: 'wrap' }}
      >
        {namedRecords.map((record) => (
          <MiniChip key={record} label={record} />
        ))}
      </Box>
    </Stack>
  );
};

export default BibleStudies;
