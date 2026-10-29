import { Box, ButtonBase, Stack } from '@mui/material';
import { IconEdit } from '@components/icons';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { generateDayNames } from '@services/i18n/translation';
import { dateFormatFriendly, formatDate } from '@utils/date';
import { circuitOverseerVisitLabel } from '@utils/circuit_overseer_visit';
import { VisitListProps } from './index.types';
import Badge from '@components/badge';
import Card from '@components/card';
import Divider from '@components/divider';
import IconButton from '@components/icon_button';
import Typography from '@components/typography';

const VisitList = ({
  visits,
  selectedVisit,
  days,
  selectedDay,
  onSelectVisit,
  onSelectDay,
  onEditVisit,
}: VisitListProps) => {
  const { t } = useAppTranslation();

  const { isAdmin } = useCurrentUser();

  const dayNames = generateDayNames();

  return (
    <Stack component="nav" aria-label={t('tr_COVisits')} spacing="16px">
      {visits.map((visit) => {
        const isSelected = visit.id === selectedVisit?.id;
        const label = circuitOverseerVisitLabel(visit.weekOf);

        return (
          <Card key={visit.id} sx={{ padding: 0, gap: 0, overflow: 'hidden' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 8px 8px 0',
              }}
            >
              <ButtonBase
                aria-expanded={isSelected}
                onClick={() => onSelectVisit(visit.id)}
                sx={{
                  flex: 1,
                  justifyContent: 'flex-start',
                  textAlign: 'start',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-l)',
                }}
              >
                <Typography className="h4">{label}</Typography>
              </ButtonBase>

              {isAdmin && (
                <IconButton
                  aria-label={`${t('tr_edit')}: ${label}`}
                  onClick={() => onEditVisit(visit)}
                >
                  <IconEdit color="var(--accent-main)" />
                </IconButton>
              )}
            </Box>

            {isSelected && (
              <Stack divider={<Divider color="var(--accent-200)" />}>
                <Divider color="var(--accent-200)" />

                {days.map((record) => (
                  <ButtonBase
                    key={record.day}
                    aria-pressed={record.day === selectedDay}
                    onClick={() => onSelectDay(record.day)}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '8px',
                      padding: '12px 16px',
                      textAlign: 'start',
                      backgroundColor:
                        record.day === selectedDay
                          ? 'var(--accent-150)'
                          : 'transparent',
                      '&:hover': { backgroundColor: 'var(--accent-100)' },
                    }}
                  >
                    <Typography
                      className="body-small-regular"
                      color={
                        record.day === selectedDay
                          ? 'var(--accent-dark)'
                          : 'var(--black)'
                      }
                    >
                      {`${dayNames[record.date.getDay()]}, ${dateFormatFriendly(formatDate(record.date, 'yyyy/MM/dd'))}`}
                    </Typography>

                    {record.events.length > 0 && (
                      <Badge
                        size="small"
                        color="accent"
                        text={String(record.events.length)}
                      />
                    )}
                  </ButtonBase>
                ))}
              </Stack>
            )}
          </Card>
        );
      })}
    </Stack>
  );
};

export default VisitList;
