import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import Typography from '@components/typography';
import IconButton from '@components/icon_button';
import { IconClose } from '@components/icons';

const BibleStudy = () => {
  const { t } = useAppTranslation();

  return (
    <Box
      sx={{
        padding: '24px',
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography className="h2">{t('tr_addNewStudy')}</Typography>
        <IconButton>
          <IconClose color="var(--black)" />
        </IconButton>
      </Box>

      <Stack spacing="8px">
        <Button variant="main">{t('tr_save')}</Button>
        <Button variant="secondary">{t('tr_cancel')}</Button>
      </Stack>
    </Box>
  );
};

export default BibleStudy;
