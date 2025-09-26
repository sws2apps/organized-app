import { Box, Stack } from '@mui/material';
import {
  IconInfo,
  IconNavigateLeft,
  IconNavigateRight,
} from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useDutiesEditor from './useDutiesEditor';
import AudioVideo from '../audio_video';
import AuditoriumAttendant from '../auditorium_attendant';
import Divider from '@components/divider';
import EntranceAttendant from '../entrance_attendant';
import Hospitality from '../hospitality';
import IconButton from '@components/icon_button';
import Microphones from '../microphones';
import Stage from '../stage';
import Typography from '@components/typography';

const DutiesEditor = () => {
  const { t } = useAppTranslation();

  const { tablet500Down } = useBreakpoints();

  const {
    weekDateLocale,
    showWeekNav,
    handleChangeWeekBack,
    handleChangeWeekNext,
  } = useDutiesEditor();

  return (
    <Box
      sx={{
        borderRadius: 'var(--radius-xl)',
        padding: '16px',
        backgroundColor: 'var(--white)',
        border: '1px solid var(--accent-300)',
        flexGrow: 1,
      }}
    >
      {weekDateLocale.length === 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconInfo color="var(--accent-400)" />
          <Typography color="var(--grey-400)">
            {t('tr_infoPlanMidweekMeeting')}
          </Typography>
        </Box>
      )}

      {weekDateLocale.length > 0 && (
        <Stack spacing="16px">
          {/* week navigation */}
          <Stack
            direction="row"
            spacing="16px"
            justifyContent={tablet500Down && 'space-between'}
          >
            <IconButton
              disabled={!showWeekNav.back}
              onClick={handleChangeWeekBack}
              sx={{ padding: '2px' }}
            >
              <IconNavigateLeft
                color={showWeekNav.back ? 'var(--black)' : 'var(--grey-300)'}
              />
            </IconButton>

            <Typography
              className="h2"
              sx={{
                minWidth: !tablet500Down && '140px',
                textAlign: 'center',
              }}
            >
              {weekDateLocale}
            </Typography>

            <IconButton
              disabled={!showWeekNav.next}
              onClick={handleChangeWeekNext}
              sx={{ padding: '2px' }}
            >
              <IconNavigateRight
                color={showWeekNav.next ? 'var(--black)' : 'var(--grey-300)'}
              />
            </IconButton>
          </Stack>

          <Divider color="var(--accent-200)" />

          {/* audio video duties */}
          <Stack spacing="12px">
            <Typography className="h4">{t('tr_dutiesAudio')}</Typography>
            <AudioVideo />
            <Microphones />
            <Stage />
          </Stack>

          <Divider color="var(--accent-200)" />

          {/* attendants duties */}
          <Stack spacing="12px">
            <Typography className="h4">{t('tr_hall')}</Typography>
            <EntranceAttendant />
            <AuditoriumAttendant />
          </Stack>

          <Divider color="var(--accent-200)" />

          {/* other duties */}
          <Stack spacing="12px">
            <Typography className="h4">{t('tr_otherPart')}</Typography>
            <Hospitality />
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default DutiesEditor;
