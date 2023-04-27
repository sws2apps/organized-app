import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import Typography from '@mui/material/Typography';
import { S1s } from '../../classes/S1s';

const S1 = ({ serviceYear, month }) => {
  const { t } = useTranslation('ui');

  const [isFinalized, setIsFinalized] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [details, setDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const handleGenerateS1 = async () => {
    setIsLoading(true);
    const currentReport = S1s.get(month);
    await currentReport.generate();
  };

  useEffect(() => {
    const currentReport = S1s.get(month);
    if (currentReport) {
      setIsFinalized(currentReport.details.isFinalized);
      setIsSubmitted(currentReport.details.isSubmitted);
      setDetails(currentReport.details);
      setIsLoading(false);
    }
  }, [month]);

  useEffect(() => {
    const initializeS1Month = async () => {
      await S1s.create(serviceYear, month);
    };

    if (serviceYear && month) initializeS1Month();
  }, [serviceYear, month]);

  return (
    <Box>
      {isLoading && (
        <CircularProgress
          color="secondary"
          size={60}
          disableShrink={true}
          sx={{
            display: 'flex',
            margin: '30px auto',
          }}
        />
      )}
      {!isLoading && (
        <>
          {!isFinalized && (
            <Box>
              <Typography>{t('S1ReportNotFinalized')}</Typography>
              <Button
                variant="outlined"
                startIcon={<FlashOnIcon />}
                sx={{ marginTop: '10px' }}
                onClick={handleGenerateS1}
              >
                {t('generate')}
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default S1;
