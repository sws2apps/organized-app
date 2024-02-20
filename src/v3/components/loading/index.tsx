import Box from '@mui/material/Box';
import IconLoading from '../icons/IconLoading';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';

const Loading = () => {
  const { t } = useAppTranslation();

  const boxStyles = {
    height: '156px',
    width: '156px',
    backgroundColor: 'var(--always-white-base)',
    borderRadius: 'var(--radius-xxl, 16px)',
    display: 'flex',
    padding: '24px 40px',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 16px 24px 0px rgba(28, 28, 28, 0.16)',
  };
  const circleLoading = {
    width: '72px',
    height: '72px',
  };

  return (
    <Box sx={boxStyles}>
      <IconLoading sx={circleLoading} color="var(--accent-main)" />
      <Typography variant="h4" color={'var(--accent-main)'} textAlign={'center'}>
        {t('Loading...')}
      </Typography>
    </Box>
  );
};

export default Loading;
