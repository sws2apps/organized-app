import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { FieldContainer } from '../shared_styles';
import { FormS4Props } from '../index.types';
import useHoursCredits from './useHoursCredits';
import HoursCreditPresets from '@features/ministry/report/hours_credit_presets';
import HoursEditor from '@features/ministry/report/hours_editor';
import StandardEditor from '../../standard_editor';
import Typography from '@components/typography';

const HoursCredits = (props: FormS4Props) => {
  const { tabletUp } = useBreakpoints();

  const { t } = useAppTranslation();

  const {
    read_only,
    hours,
    handleHoursChange,
    hoursValidator,
    fieldRef,
    handleSelectPreset,
    isSelf,
  } = useHoursCredits(props);

  return (
    <>
      {!read_only && (
        <FieldContainer
          ref={fieldRef}
          sx={{
            gap: '4px',
            alignItems: 'center',
            flexDirection: tabletUp ? 'row' : 'column',
          }}
        >
          <HoursCreditPresets
            anchorEl={fieldRef}
            onSelect={handleSelectPreset}
          />

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
          <Typography>{t('tr_creditHours')}</Typography>

          <Typography
            className="h3"
            color={hours === '0:00' ? 'var(--accent-350)' : 'var(--black)'}
          >
            {hours.split(':').at(0)}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default HoursCredits;
