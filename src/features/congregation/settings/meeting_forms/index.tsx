import { Stack } from '@mui/material';
import { formatDate } from '@services/dateformat';
import { useAppTranslation } from '@hooks/index';
import { CardSection, CardSectionHeader } from '../../shared_styles/components';
import { FullnameOption, SourceFrequency } from '@definition/settings';
import useMeetingForms from './useMeetingForms';
import DisplayName from './display_name';
import Divider from '@components/divider';
import MenuItem from '@components/menuitem';
import MidweekExactDate from './midweek_exact_date';
import Select from '@components/select';
import SwitchWithLabel from '@components/switch_with_label';

const MeetingForms = () => {
  const { t } = useAppTranslation();

  const {
    sourceAutoUpdate,
    handleSourceAutoUpdateToggle,
    handleSourceUpdateFrequencyChange,
    sourceUpdateFrequency,
    fullnameOption,
    handleFullnameOptionChange,
    handleShortDateFormatChange,
    shortDateFormat,
    shortDateFormatOptions,
  } = useMeetingForms();

  return (
    <CardSection>
      <Stack spacing="24px" divider={<Divider color="var(-accent-200)" />}>
        <Stack spacing="16px">
          <CardSectionHeader title={t('tr_meetinMaterialsTitle')} />

          <SwitchWithLabel
            label={t('tr_autoCheckUpdate')}
            helper={t('tr_autoCheckUpdateDesc')}
            checked={sourceAutoUpdate}
            onChange={handleSourceAutoUpdateToggle}
          />

          {sourceAutoUpdate && (
            <Select
              label={t('tr_autoCheckFrequency')}
              value={sourceUpdateFrequency}
              onChange={(e) =>
                handleSourceUpdateFrequencyChange(+e.target.value)
              }
            >
              <MenuItem value={SourceFrequency.WEEKLY}>
                {t('tr_everyWeek')}
              </MenuItem>
              <MenuItem value={SourceFrequency.BIWEEKLY}>
                {t('tr_everyTwoWeeks')}
              </MenuItem>
              <MenuItem value={SourceFrequency.MONTHLY}>
                {t('tr_everyMonth')}
              </MenuItem>
            </Select>
          )}
        </Stack>

        <Stack spacing="16px">
          <MidweekExactDate />

          <DisplayName />
        </Stack>

        <Stack spacing="16px">
          <Select
            label={t('tr_nameFormat')}
            value={fullnameOption}
            onChange={(e) => handleFullnameOptionChange(+e.target.value)}
          >
            <MenuItem value={FullnameOption.FIRST_BEFORE_LAST}>
              {t('tr_formatFirstLast')}
            </MenuItem>
            <MenuItem value={FullnameOption.LAST_BEFORE_FIRST}>
              {t('tr_formatLastFirst')}
            </MenuItem>
          </Select>

          <Select
            label={t('tr_dateFormatSelect')}
            value={shortDateFormat}
            onChange={(e) => handleShortDateFormatChange(e.target.value)}
          >
            {shortDateFormatOptions.map((format) => (
              <MenuItem key={format} value={format}>
                {formatDate(new Date(2024, 10, 20), format)}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Stack>
    </CardSection>
  );
};

export default MeetingForms;
