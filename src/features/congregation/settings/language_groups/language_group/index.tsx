import { Box } from '@mui/material';
import { LanguageGroupProps } from './index.types';
import useLanguageGroup from './useLanguageGroup';
import GroupDelete from '../group_delete';
import GroupEdit from '../group_edit';
import Typography from '@components/typography';

const LanguageGroup = (props: LanguageGroupProps) => {
  const { group_name } = useLanguageGroup(props);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        justifyContent: 'space-between',
      }}
    >
      <Typography className="h3">{group_name}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <GroupEdit group={props.group} />
        <GroupDelete group={props.group} />
      </Box>
    </Box>
  );
};

export default LanguageGroup;
