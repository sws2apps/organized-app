import { Stack } from '@mui/material';
import { useAtomValue } from 'jotai';
import { IconHide, IconNormalPin } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { CIRCUIT_OVERSEER_EVENT_LABELS } from '@constants/circuit_overseer_visit';
import { personsState } from '@states/persons';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
  hour24FormatState,
} from '@states/settings';
import { personGetDisplayName } from '@utils/common';
import { formatDate, generateDateFromTime } from '@utils/date';
import { EventItemProps } from './index.types';
import Badge from '@components/badge';
import MeetingFields from '../meeting_fields';
import Typography from '@components/typography';

const EventItem = ({ event, weekOf }: EventItemProps) => {
  const { t } = useAppTranslation();

  const hour24 = useAtomValue(hour24FormatState);
  const persons = useAtomValue(personsState);
  const displayNameEnabled = useAtomValue(displayNameMeetingsEnableState);
  const fullnameOption = useAtomValue(fullnameOptionState);

  const data = event.event_data;

  const time = data.time
    ? formatDate(generateDateFromTime(data.time), hour24 ? 'HH:mm' : 'h:mm a')
    : '—';

  const hosts = persons
    .filter((person) => data.hosts.includes(person.person_uid))
    .map((person) =>
      personGetDisplayName(person, displayNameEnabled, fullnameOption)
    )
    .join(', ');

  return (
    <Stack direction="row" spacing="16px" sx={{ alignItems: 'flex-start' }}>
      <Badge
        size="medium"
        color="accent"
        faded
        text={time}
        sx={{ flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}
      />

      <Stack spacing="4px" sx={{ flex: 1, minWidth: 0 }}>
        <Typography className="h4">
          {t(CIRCUIT_OVERSEER_EVENT_LABELS[data.category])}
        </Typography>

        {(data.category === 'midweek' || data.category === 'weekend') && (
          <MeetingFields meeting={data.category} weekOf={weekOf} />
        )}

        {hosts && (
          <Typography className="body-small-regular">{hosts}</Typography>
        )}

        {data.address && (
          <Stack direction="row" spacing="4px" sx={{ alignItems: 'center' }}>
            <IconNormalPin color="var(--grey-400)" />
            <Typography className="body-small-regular" color="var(--grey-400)">
              {data.address}
            </Typography>
          </Stack>
        )}

        {data.notes && (
          <Typography
            className="body-small-regular"
            sx={{ whiteSpace: 'pre-wrap' }}
          >
            {data.notes}
          </Typography>
        )}

        {data.elders_only && (
          <Badge
            size="small"
            color="accent"
            icon={<IconHide />}
            text={t('tr_COEldersOnly')}
            sx={{ alignSelf: 'flex-start' }}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default EventItem;
