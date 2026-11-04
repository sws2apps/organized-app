import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { LivingPartProps } from './index.types';
import useLivingPart from './useLivingPart';
import BrotherAssignment from '../brother_assignment';
import Checkbox from '@components/checkbox';
import TextField from '@components/textfield';

const LivingPart = (props: LivingPartProps) => {
  const { t } = useAppTranslation();

  const { isEdit, selectedWeek } = props;

  const { tabletDown } = useBreakpoints();

  const {
    type,
    handleToggleOverwrite,
    isOverwrite,
    isGBUpdate,
    gbUpdateNumber,
    handleToggleGBUpdate,
    handleGBUpdateNumberChange,
  } = useLivingPart(props);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {isEdit && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: tabletDown ? 'column' : 'row',
            alignItems: tabletDown ? 'flex-start' : 'center',
            gap: tabletDown ? '8px' : '32px',
          }}
        >
          <Checkbox
            label={t('tr_overwriteWithCustomData')}
            checked={isOverwrite}
            onChange={handleToggleOverwrite}
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: tabletDown ? '12px' : '16px',
              minHeight: '44px',
            }}
          >
            <Checkbox
              label={t('tr_governingBodyUpdate')}
              checked={isGBUpdate}
              onChange={handleToggleGBUpdate}
            />

            {isGBUpdate && (
              <TextField
                autoFocus={gbUpdateNumber.length === 0}
                label={t('tr_number')}
                value={gbUpdateNumber}
                onChange={(e) => handleGBUpdateNumberChange(e.target.value)}
                slotProps={{ htmlInput: { inputMode: 'numeric' } }}
                sx={{ width: tabletDown ? '80px' : '96px', flexShrink: 0 }}
              />
            )}
          </Box>
        </Box>
      )}

      <BrotherAssignment
        isEdit={isEdit}
        durationEditable={true}
        selectedWeek={selectedWeek}
        type={type}
        isOverwrite={isOverwrite}
      />
    </Box>
  );
};

export default LivingPart;
