import { Box, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { FieldContainer } from '../shared_styles';
import { FormS4Props } from '../index.types';
import useHoursFields from './useHoursFields';
import HoursEditor from '@features/ministry/report/hours_editor';
import StandardEditor from '../../standard_editor';
import Typography from '@components/typography';

const HoursFields = (props: FormS4Props) => {
  const { tabletUp } = useBreakpoints();

  const { t } = useAppTranslation();

  const {
    read_only,
    goal,
    hours_credit_enabled,
    hours,
    hours_total,
    handleHoursChange,
    hoursValidator,
    isSelf,
  } = useHoursFields(props);

  return (
    <>
      {!read_only && (
        <FieldContainer
          sx={{
            gap: '4px',
            alignItems: 'center',
            flexDirection: tabletUp ? 'row' : 'column',
          }}
        >
          <Typography sx={{ flex: 1 }}>{t('tr_hours')}</Typography>

          {props.publisher && isSelf && (
            <HoursEditor
              value={hours}
              onChange={handleHoursChange}
              validator={hoursValidator}
            />
          )}

          {(!props.publisher || !isSelf) && (
            <StandardEditor
              value={+(hours.split(':').at(0) || 0)}
              onChange={(value) => handleHoursChange(`${value}:00`)}
              validator={(value) => hoursValidator(`${value}:00`)}
            />
          )}
        </FieldContainer>
      )}

      {read_only && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          <Stack>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              <Typography>{t('tr_totalHours')}</Typography>
              {goal && (
                <Typography
                  className="body-small-semibold"
                  color="var(--accent-dark)"
                  sx={{
                    borderRadius: 'var(--radius-s)',
                    padding: '2px 8px',
                    backgroundColor: 'var(--accent-150)',
                  }}
                >
                  {t('tr_badgeGoalHours', { ministryTime: goal })}
                </Typography>
              )}
            </Box>

            {hours_credit_enabled && (
              <Typography
                className="body-small-regular"
                color="var(--grey-350)"
              >
                {t('tr_includesServiceAndCredit')}
              </Typography>
            )}
          </Stack>

          <Typography
            className="h2"
            color={
              hours_total === '0:00' ? 'var(--accent-350)' : 'var(--black)'
            }
          >
            {hours_total}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default HoursFields;
