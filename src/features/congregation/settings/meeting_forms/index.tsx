import { Stack } from '@mui/material';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import {
  CardSection,
  CardSectionContent,
  CardSectionHeader,
  CardSubSectionHeader,
} from '../shared_styles';
import { SourceFrequency } from '@definition/settings';
import useMeetingForms from './useMeetingForms';
import DateFormat from './date_format';
import DisplayName from './display_name';
import MenuItem from '@components/menuitem';
import MidweekExactDate from './midweek_exact_date';
import NameFormat from './name_format';
import PublishersSort from '../congregation_privacy/publishers_sort';
import Select from '@components/select';
import SourceLanguage from './source_language';
import SwitchWithLabel from '@components/switch_with_label';
import SongsWeekend from './songs_weekend';
import Typography from '@components/typography';
import FirstDayOfTheWeek from '../first_day_week';

const MeetingForms = () => {
  const { t } = useAppTranslation();

  const { isMidweekEditor, isWeekendEditor, isPublicTalkCoordinator, isGroup } =
    useCurrentUser();

  const {
    sourceAutoUpdate,
    handleSourceAutoUpdateToggle,
    handleSourceUpdateFrequencyChange,
    sourceUpdateFrequency,
  } = useMeetingForms();

  return (
    <CardSection>
      <CardSectionHeader title={t('tr_meetinMaterialsTitle')} />

      <CardSectionContent marginTop="-8px !important">
        {!isGroup && (
          <Stack spacing="16px">
            <SwitchWithLabel
              label={t('tr_autoCheckUpdate')}
              helper={t('tr_autoCheckUpdateDesc')}
              checked={sourceAutoUpdate}
              onChange={handleSourceAutoUpdateToggle}
              readOnly={
                !isMidweekEditor && !isWeekendEditor && !isPublicTalkCoordinator
              }
            />

            {sourceAutoUpdate && (
              <Select
                readOnly={
                  !isMidweekEditor &&
                  !isWeekendEditor &&
                  !isPublicTalkCoordinator
                }
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

            <SourceLanguage />
          </Stack>
        )}

        <Stack spacing="16px">
          <MidweekExactDate />

          <SongsWeekend />

          <DisplayName />
        </Stack>

        <Stack spacing="16px" marginTop="24px !important">
          <NameFormat />

          <DateFormat />

          <FirstDayOfTheWeek />
        </Stack>

        {!isGroup && (
          <Stack spacing="16px">
            <CardSubSectionHeader title={t('tr_fieldServiceGroups')} />
            <PublishersSort />
          </Stack>
        )}
      </CardSectionContent>
    </CardSection>
  );
};

export default MeetingForms;
