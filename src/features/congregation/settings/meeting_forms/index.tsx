import { Box, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints, useCurrentUser } from '@hooks/index';
import {
  CardSection,
  CardSectionContent,
  CardSectionHeader,
} from '../shared_styles';
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

  const { tabletUp } = useBreakpoints();

  const {
    sourceAutoUpdate,
    handleSourceAutoUpdateToggle,
    handleSourceUpdateFrequencyChange,
    sourceUpdateFrequency,
  } = useMeetingForms();

  return (
    <Stack spacing="16px">
      <CardSection>
        <CardSectionHeader title={t('tr_meetinMaterialsTitle')} />
        
        <CardSectionContent marginTop="-8px !important" sx={{ '& > hr': { display: 'none' } }}>
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
                sx={{ maxWidth: tabletUp ? '600px' : 'none' }}
              />

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: tabletUp ? 'row' : 'column',
                  gap: '16px',
                  maxWidth: tabletUp ? '600px' : 'none',
                }}
              >
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
                    sx={{ flex: 1 }}
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
                
                <Box sx={{ flex: 1 }}>
                  <SourceLanguage />
                </Box>
              </Box>
            </Stack>
          )}

          <Stack spacing="16px" sx={{ maxWidth: tabletUp ? '600px' : 'none' }}>
            <MidweekExactDate />
            <SongsWeekend />
            <DisplayName />
          </Stack>
        </CardSectionContent>
      </CardSection>
    </Stack>
  );
};

export default MeetingForms;
