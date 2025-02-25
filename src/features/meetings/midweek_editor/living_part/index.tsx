import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { LivingPartProps } from './index.types';
import useLivingPart from './useLivingPart';
import BrotherAssignment from '../brother_assignment';
import Checkbox from '@components/checkbox';

const LivingPart = (props: LivingPartProps) => {
  const { t } = useAppTranslation();

  const { isEdit, selectedWeek } = props;

  const { type, handleToggleOverwrite, isOverwrite } = useLivingPart(props);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {isEdit && (
        <Checkbox
          label={t('tr_overwriteWithCustomData')}
          checked={isOverwrite}
          onChange={handleToggleOverwrite}
        />
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
