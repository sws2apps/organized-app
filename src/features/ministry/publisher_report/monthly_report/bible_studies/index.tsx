import { Box, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useBibleStudies from './useBibleStudies';
import Typography from '@components/typography';
import MiniChip from '@components/mini_chip';
import StandardEditor from '@features/ministry/standard_editor';

const BibleStudies = () => {
  const { t } = useAppTranslation();

  const { tabletUp } = useBreakpoints();

  const {
    value,
    handleValueChange,
    bibleStudiesValidator,
    namedRecords,
    status,
  } = useBibleStudies();

  return (
    <Stack spacing="8px">
      <Box
        sx={{
          display: 'flex',
          alignItems: tabletUp ? 'center' : 'unset',
          justifyContent: 'space-between',
          gap: '8px',
          flexDirection: tabletUp || status !== 'pending' ? 'row' : 'column',
        }}
      >
        <Typography>{t('tr_bibleStudies')}</Typography>
        <StandardEditor
          readOnly={status !== 'pending'}
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
