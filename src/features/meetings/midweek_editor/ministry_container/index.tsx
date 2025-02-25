import { Stack } from '@mui/material';
import { MinistryContainerProps } from './index.types';
import useMinistryContainer from './useMinistryContainer';
import Divider from '@components/divider';
import MinistryPart from '../ministry_part';

const MinistryContainer = (props: MinistryContainerProps) => {
  const { isEdit, selectedWeek } = props;

  const { countArray } = useMinistryContainer(props);

  return (
    <Stack spacing="16px" divider={<Divider color="var(--accent-200)" />}>
      {countArray.map((part) => (
        <MinistryPart
          key={part}
          part={part}
          isEdit={isEdit}
          selectedWeek={selectedWeek}
        />
      ))}
    </Stack>
  );
};

export default MinistryContainer;
