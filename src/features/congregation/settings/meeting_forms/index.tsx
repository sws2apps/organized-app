import { Stack } from '@mui/material';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import {
  CardSection,
  CardSectionContent,
  CardSectionHeader,
} from '../shared_styles';
import { SourceFrequency } from '@definition/settings';
import useMeetingForms from './useMeetingForms';
import DateFormat from './date_format';
import DisplayName from './display_name';
import MenuItem from '@components/menuitem';
import MidweekExactDate from './midweek_exact_date';
import NameFormat from './name_format';
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
          <NameFormat />

          <DateFormat />
        </Stack>
      </CardSectionContent>
    </CardSection>
  );
};

export default MeetingForms;
