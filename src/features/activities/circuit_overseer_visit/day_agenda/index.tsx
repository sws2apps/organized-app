import { Stack } from '@mui/material';
import { IconAdd } from '@components/icons';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { generateDayNames } from '@services/i18n/translation';
import { dateFormatFriendly, formatDate } from '@utils/date';
import { DayAgendaProps } from './index.types';
import useDayAgenda from './useDayAgenda';
import Button from '@components/button';
import Card from '@components/card';
import Divider from '@components/divider';
import EventEditor from '../event_editor';
import EventItem from '../event_item';
import InfoNote from '@components/info_note';
import Typography from '@components/typography';

const DayAgenda = (props: DayAgendaProps) => {
  const { t } = useAppTranslation();

  const { isAdmin } = useCurrentUser();

  const { overseer, handleAddEvent } = useDayAgenda(props);

  const { visit, day } = props;

  const dayName = generateDayNames()[day.date.getDay()];

  return (
    <Card>
      <Stack spacing="4px">
        <Typography className="h2">
          {`${dayName}, ${dateFormatFriendly(formatDate(day.date, 'yyyy/MM/dd'))}`}
        </Typography>

        {overseer && (
          <Typography className="body-small-regular" color="var(--grey-400)">
            {overseer}
          </Typography>
        )}
      </Stack>

      <Divider color="var(--accent-200)" />

      {day.events.length === 0 && (
        <InfoNote message={t('tr_CONothingPlanned')} />
      )}

      <Stack spacing="16px" divider={<Divider color="var(--accent-200)" />}>
        {day.events.map((event) =>
          isAdmin ? (
            <EventEditor
              key={event.event_uid}
              event={event}
              weekOf={visit.weekOf}
            />
          ) : (
            <EventItem
              key={event.event_uid}
              event={event}
              weekOf={visit.weekOf}
            />
          )
        )}
      </Stack>

      {isAdmin && (
        <Button
          variant="small"
          startIcon={<IconAdd />}
          disableAutoStretch
          sx={{ alignSelf: 'flex-end' }}
          onClick={handleAddEvent}
        >
          {t('tr_COAddActivity')}
        </Button>
      )}
    </Card>
  );
};

export default DayAgenda;
