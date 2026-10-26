import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { DUTIES_MAX } from '../../shared/constants';
import { Stack } from '@mui/material';
import {
  IconAtHome,
  IconAudioMixer,
  IconComputerVideo,
  IconConference,
  IconDoor,
  IconHallOverseer,
  IconMicrophone,
  IconTalk,
} from '@components/icons';
import { DutyStandard } from '@features/congregation/settings/meeting_duties/standard_duties/index.types';
import { DutyItemProps } from './index.types';
import useDutyItem from './useDutyItem';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';

const DUTY_ICONS: Record<DutyStandard, typeof IconAudioMixer> = {
  tr_audioVideo: IconComputerVideo,
  tr_dutiesAudio: IconAudioMixer,
  tr_dutiesVideo: IconComputerVideo,
  tr_dutiesMicrophones: IconMicrophone,
  tr_dutiesStage: IconTalk,
  tr_dutiesEntranceAttendant: IconDoor,
  tr_dutiesAuditoriumAttendant: IconHallOverseer,
  tr_hospitality: IconAtHome,
  tr_dutiesVideoconferenceHost: IconConference,
};

const DutyItem = (props: DutyItemProps) => {
  const { t } = useAppTranslation();
  const { isDutiesEditor } = useCurrentUser();

  const { value, handleAmountChange } = useDutyItem(props);
  const Icon = DUTY_ICONS[props.duty];

  return (
    <Stack
      sx={{
        minWidth: 0,
        justifyContent: 'space-between',
        gap: 'var(--dialog-gap-mobile)',
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          gap: 'var(--dialog-header-gap)',
          color: 'var(--black)',
        }}
      >
        <Icon
          width={20}
          height={20}
          color="currentColor"
          sx={{ flexShrink: 0 }}
        />
        <Typography
          color="inherit"
          sx={{ minWidth: 0, overflowWrap: 'anywhere' }}
        >
          {t(props.duty)}
        </Typography>
      </Stack>

      <Select
        label={t('tr_dutyPeopleNeeded')}
        inputProps={{
          'aria-label': t('tr_dutyPeopleNeededFor', { duty: t(props.duty) }),
        }}
        readOnly={!isDutiesEditor}
        value={value}
        onChange={handleAmountChange}
      >
        <MenuItem value={0}>
          <Typography>{t('tr_disabledLabel')}</Typography>
        </MenuItem>

        {DUTIES_MAX.map((num) => (
          <MenuItem key={num} value={num}>
            <Typography>{num}</Typography>
          </MenuItem>
        ))}
      </Select>
    </Stack>
  );
};

export default DutyItem;
