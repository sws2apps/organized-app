import { Box, Stack } from '@mui/material';
import { IconCustom, IconDelete } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { LivingContainerProps } from './index.types';
import useLivingContainer from './useLivingContainer';
import Divider from '@components/divider';
import LivingPart from '../living_part';
import Typography from '@components/typography';
import Button from '@components/button';
import BrotherAssignment from '../brother_assignment';

const LivingContainer = (props: LivingContainerProps) => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const { selectedWeek, isEdit } = props;

  const {
    countArray,
    hasCustomPart,
    handleDeleteCustomLCPart,
    customPartEnabled,
    handleAddCustomLCPart,
  } = useLivingContainer(props);

  return (
    <>
      <Stack spacing="16px" divider={<Divider color="var(--accent-200)" />}>
        {countArray.map((part) => (
          <LivingPart
            key={part}
            part={part}
            isEdit={isEdit}
            selectedWeek={selectedWeek}
          />
        ))}
      </Stack>

      {/* lc_part3 */}
      {hasCustomPart && (
        <>
          <Divider color="var(--accent-200)" />

          <Typography color="var(--grey-350)">
            {t('tr_customMeetingPartDesc')}
          </Typography>

          <BrotherAssignment
            isEdit={isEdit}
            durationEditable={true}
            selectedWeek={selectedWeek}
            type="lc_part3"
            isOverwrite={true}
          />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '16px',
              width: desktopUp ? 'unset' : '100%',
            }}
          >
            <Button
              variant="small"
              color="red"
              startIcon={<IconDelete />}
              sx={{ minHeight: '32px', width: 'fit-content' }}
              onClick={handleDeleteCustomLCPart}
            >
              {t('tr_customMeetingPartDelete')}
            </Button>
          </Box>
        </>
      )}

      {/* Add custom part */}

      {isEdit && customPartEnabled && (
        <>
          <Divider color="var(--accent-200)" />

          <Button
            variant="small"
            startIcon={<IconCustom />}
            sx={{ minHeight: '32px', width: 'fit-content' }}
            onClick={handleAddCustomLCPart}
          >
            {t('tr_addCustomMeetingPart')}
          </Button>
        </>
      )}
    </>
  );
};

export default LivingContainer;
