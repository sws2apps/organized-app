import { Box, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints, useCurrentUser } from '@hooks/index';
import {
  CardSection,
  CardSectionContent,
  CardSectionHeader,
  CardSubSectionHeader,
} from '../shared_styles';
import Divider from '@components/divider';
import { SourceFrequency } from '@definition/settings';
import useMeetingForms from './useMeetingForms';
import DisplayName from './display_name';
import MenuItem from '@components/menuitem';
import MidweekExactDate from './midweek_exact_date';

import Select from '@components/select';
import SourceLanguage from './source_language';
import SwitchWithLabel from '@components/switch_with_label';
import SongsWeekend from './songs_weekend';
import Typography from '@components/typography';

const MeetingForms = () => {
  const { t } = useAppTranslation();

  const { isMidweekEditor, isWeekendEditor, isPublicTalkCoordinator, isGroup } =
    useCurrentUser();

  const { tabletUp, desktopUp } = useBreakpoints();

  const {
    sourceAutoUpdate,
    handleSourceAutoUpdateToggle,
    handleSourceUpdateFrequencyChange,
    sourceUpdateFrequency,
  } = useMeetingForms();

  return (
    <>
      <CardSection>
        <CardSectionHeader title={t('tr_meetinMaterialsTitle')} />
        
        <CardSectionContent marginTop="-8px !important" sx={{ '& > hr': { display: 'none' } }}>
          {!isGroup && (
            <Stack spacing="16px">
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: desktopUp ? 'row' : 'column',
                  gap: '16px',
                  alignItems: desktopUp ? 'center' : 'stretch',
                }}
              >
                <Box sx={{ flex: desktopUp ? 65 : 1 }}>
                  <SwitchWithLabel
                    label={t('tr_autoCheckUpdate')}
                    helper={t('tr_autoCheckUpdateDesc')}
                    checked={sourceAutoUpdate}
                    onChange={handleSourceAutoUpdateToggle}
                    readOnly={
                      !isMidweekEditor && !isWeekendEditor && !isPublicTalkCoordinator
                    }
                  />
                </Box>

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
                    sx={{ flex: desktopUp ? 35 : 1 }}
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
              </Box>
                
              <Box>
                <SourceLanguage />
              </Box>
            </Stack>
          )}

          <Box>
            {!isGroup && <Divider color="var(--accent-200)" sx={{ mb: '16px' }} />}
            <CardSubSectionHeader 
              title={t('tr_formsAndSchedulesPreferences')} 
              description={t('tr_formsAndSchedulesPreferencesDesc')} 
            />
            <Stack spacing="16px" sx={{ maxWidth: tabletUp ? '600px' : 'none', mt: '24px' }}>
              <MidweekExactDate />
              <SongsWeekend />
              <DisplayName />
            </Stack>
          </Box>
        </CardSectionContent>
      </CardSection>
    </>
  );
};

export default MeetingForms;
