import { Box } from '@mui/material';
import { PersonItemProps } from './index.types';
import usePersonItem from './usePersonItem';
import Checkbox from '@components/checkbox';

const PersonItem = (props: PersonItemProps) => {
  const { name } = usePersonItem(props);

  return (
    <Box sx={{ padding: '2px 0' }}>
      <Checkbox label={name} />
    </Box>
  );
};

export default PersonItem;
