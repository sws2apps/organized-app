import { Box, Stack } from '@mui/material';
import { IconArrowBack, IconInfo } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useReportDetails from './useReportDetails';
import BibleStudies from './bible_studies';
import Button from '@components/button';
import Card from '@components/card';
import Comments from './comments';
import CreditField from './credit_field';
import Divider from '@components/divider';
import HoursField from './hours_field';
import LateReport from './late_report';
import MinistryShared from './ministry_shared';
import PersonDetails from '../person_details';
import Typography from '@components/typography';

const ReportDetails = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const { person, hoursEnabled, creditEnabled, handleBack } =
    useReportDetails();

  return (
    <Card sx={{ position: 'sticky', top: '72px' }}>
      {!person && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconInfo color="var(--grey-350)" />
          <Typography color="var(--grey-350)">
            {t('tr_reportPageInfo')}
          </Typography>
        </Box>
      )}

      {person && (
        <Stack spacing="24px">
          <Stack spacing="24px" divider={<Divider color="var(--accent-200)" />}>
            <Stack spacing="8px">
              {!desktopUp && (
                <Button
                  variant="small"
                  onClick={handleBack}
                  startIcon={<IconArrowBack width={18} height={18} />}
                  sx={{
                    height: '32px',
                    minHeight: '32px',
                    alignSelf: 'flex-start',
                    padding: '0 8px',
                  }}
                >
                  {t('tr_back')}
                </Button>
              )}

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                }}
              >
                <PersonDetails person={person} />
                <LateReport person={person} />
              </Box>
            </Stack>

            {hoursEnabled && (
              <Stack
                spacing="24px"
                divider={<Divider dashed color="var(--accent-200)" />}
              >
                <HoursField person={person} />

                {creditEnabled && <CreditField person={person} />}
              </Stack>
            )}

            {!hoursEnabled && <MinistryShared person={person} />}

            <BibleStudies person={person} />
          </Stack>

          <Comments person={person} />
        </Stack>
      )}
    </Card>
  );
};

export default ReportDetails;
