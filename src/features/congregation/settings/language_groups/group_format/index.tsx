import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { formatDate } from '@utils/date';
import { FullnameOption, FirstDayWeekOption } from '@definition/settings';
import { CardSection, CardSectionContent, CardSectionHeader } from '../../shared_styles';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';
import SwitchWithLabel from '@components/switch_with_label';
import useGroupFormat from './useGroupFormat';

const shortDateFormatOptions = [
  'MM/dd/yyyy',
  'dd/MM/yyyy',
  'MM.dd.yyyy',
  'dd.MM.yyyy',
  'yyyy-MM-dd',
  'yyyy-dd-MM',
];

const GroupFormat = ({ groupId }: { groupId: string }) => {
  const { t } = useAppTranslation();
  const { desktopUp } = useBreakpoints();

  const {
    nameFormat,
    dateFormat,
    weekStart,
    hour24,
    handleNameFormatChange,
    handleDateFormatChange,
    handleWeekStartChange,
    handleHour24Toggle,
  } = useGroupFormat(groupId);

  return (
    <CardSection>
      <CardSectionHeader
        title={t('tr_dateAndFormat')}
        description={t('tr_appConfigSidebarDesc')}
      />

      <CardSectionContent marginTop="-8px !important">
        <Box
          sx={{
            display: 'flex',
            flexDirection: desktopUp ? 'row' : 'column',
            gap: '16px',
            alignItems: 'flex-start',
            width: '100%',
          }}
        >
          <Select
            label={t('tr_nameFormat')}
            value={nameFormat}
            onChange={(e) => handleNameFormatChange(+e.target.value)}
            sx={{ flex: 1, width: '100%' }}
          >
            <MenuItem value={FullnameOption.FIRST_BEFORE_LAST}>
              <Typography>{t('tr_formatFirstLast')}</Typography>
            </MenuItem>
            <MenuItem value={FullnameOption.LAST_BEFORE_FIRST}>
              <Typography>{t('tr_formatLastFirst')}</Typography>
            </MenuItem>
          </Select>

          <Select
            label={t('tr_dateFormatSelect')}
            value={dateFormat}
            onChange={(e) => handleDateFormatChange(e.target.value as string)}
            sx={{ flex: 1, width: '100%' }}
          >
            {shortDateFormatOptions.map((format) => (
              <MenuItem key={format} value={format}>
                <Typography>{formatDate(new Date(2024, 10, 29), format)}</Typography>
              </MenuItem>
            ))}
          </Select>

          <Select
            label={t('tr_firstDayOfTheWeek')}
            value={weekStart}
            onChange={(e) => handleWeekStartChange(+e.target.value)}
            sx={{ flex: 1, width: '100%' }}
          >
            <MenuItem value={FirstDayWeekOption.MONDAY}>
              <Typography>{t('tr_monday')}</Typography>
            </MenuItem>
            <MenuItem value={FirstDayWeekOption.SUNDAY}>
              <Typography>{t('tr_sunday')}</Typography>
            </MenuItem>
            <MenuItem value={FirstDayWeekOption.SATURDAY}>
              <Typography>{t('tr_saturday')}</Typography>
            </MenuItem>
          </Select>
        </Box>

        <Box sx={{ mt: '16px' }}>
          <SwitchWithLabel
            label={t('tr_24hFormat')}
            checked={hour24}
            onChange={(e) => handleHour24Toggle(e.target.checked)}
          />
        </Box>
      </CardSectionContent>
    </CardSection>
  );
};

export default GroupFormat;
