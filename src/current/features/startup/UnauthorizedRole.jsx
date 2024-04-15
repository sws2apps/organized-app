import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Typography from '@mui/material/Typography';

const UnauthorizedRole = () => {
  const { t } = useTranslation('ui');

  return (
    <Container sx={{ marginTop: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '15px' }}>
        {t('unauthorized')}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '20px',
          margin: '30px 0',
        }}
      >
        <ReportProblemIcon
          color="error"
          sx={{
            fontSize: '60px',
            cursor: 'pointer',
          }}
        />
        <Typography>{t('unauthorizedRole')}</Typography>
      </Box>
    </Container>
  );
};

export default UnauthorizedRole;
