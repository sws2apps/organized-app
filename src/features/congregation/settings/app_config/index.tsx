import { Box, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { CardSection, CardSectionContent, CardSectionHeader } from '../shared_styles';
import DateFormat from '../meeting_forms/date_format';
import NameFormat from '../meeting_forms/name_format';
import FirstDayOfTheWeek from '../first_day_week';

const AppConfig = () => {
  const { t } = useAppTranslation();
  const { desktopUp } = useBreakpoints();

  return (
    <Stack spacing="16px">
      <CardSection>
        <CardSectionHeader title={t('tr_dateAndFormat')} description={t('tr_dateAndFormatDesc')} />
        <CardSectionContent sx={{ '& > hr': { display: 'none' } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: desktopUp ? 'row' : 'column',
              gap: '16px',
              '& > *': { flex: 1 },
            }}
          >
            <NameFormat />
            <DateFormat />
            <FirstDayOfTheWeek />
          </Box>
        </CardSectionContent>
      </CardSection>
    </Stack>
  );
};

export default AppConfig;
