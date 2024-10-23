import { Stack } from '@mui/material';
import { formatDate } from '@services/dateformat';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import {
  CardSection,
  CardSectionContent,
  CardSectionHeader,
} from '../shared_styles';
import { FullnameOption, SourceFrequency } from '@definition/settings';
import useMeetingForms from './useMeetingForms';
import DisplayName from './display_name';
import MenuItem from '@components/menuitem';
import MidweekExactDate from './midweek_exact_date';
import Select from '@components/select';
import SwitchWithLabel from '@components/switch_with_label';
import Typography from '@components/typography';

const MeetingForms = () => {
  const { t } = useAppTranslation();

  const { isMidweekEditor, isWeekendEditor, isPublicTalkCoordinator } =
    useCurrentUser();

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
      <CardSectionHeader title={t('tr_meetinMaterialsTitle')} />

      <CardSectionContent marginTop="-8px !important">
        {(isMidweekEditor || isWeekendEditor || isPublicTalkCoordinator) && (
          <Stack spacing="16px">
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
                  <Typography>{t('tr_everyWeek')}</Typography>
                </MenuItem>
                <MenuItem value={SourceFrequency.BIWEEKLY}>
                  <Typography>{t('tr_everyTwoWeeks')}</Typography>
                </MenuItem>
                <MenuItem value={SourceFrequency.MONTHLY}>
                  <Typography>{t('tr_everyMonth')}</Typography>
                </MenuItem>
              </Select>
            )}
          </Stack>
        )}

        <Stack spacing="16px">
          <MidweekExactDate />

          <DisplayName />
        </Stack>

        <Stack spacing="16px" marginTop="24px !important">
          <Select
            label={t('tr_nameFormat')}
            value={fullnameOption}
            onChange={(e) => handleFullnameOptionChange(+e.target.value)}
            readOnly={
              !isMidweekEditor && !isWeekendEditor && !isPublicTalkCoordinator
            }
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
            value={shortDateFormat}
            onChange={(e) =>
              handleShortDateFormatChange(e.target.value as string)
            }
            readOnly={
              !isMidweekEditor && !isWeekendEditor && !isPublicTalkCoordinator
            }
          >
            {shortDateFormatOptions.map((format) => (
              <MenuItem key={format} value={format}>
                <Typography>
                  {formatDate(new Date(2024, 10, 20), format)}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </CardSectionContent>
    </CardSection>
  );
};

export default MeetingForms;
