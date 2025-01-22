import { Box } from '@mui/material';
import { IconCheck, IconEdit } from '@components/icons';
import { BibleStudyItemProps } from './index.types';
import useBibleStudyItem from './useBibleStudyItem';
import MenuItem from '@components/menuitem';
import Typography from '@components/typography';
import IconButton from '@components/icon_button';

const BibleStudyItem = (props: BibleStudyItemProps) => {
  const { handleEditStudy, handleSelectStudy } = useBibleStudyItem(props);

  return (
    <MenuItem
      sx={{ height: '40px', minHeight: '40px' }}
      onClick={props.selected ? null : handleSelectStudy}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            paddingLeft: '12px',
          }}
        >
          <IconButton onClick={handleEditStudy} sx={{ padding: 0 }}>
            <IconEdit color="var(--accent-350)" />
          </IconButton>
          <Typography color="var(--accent-dark)">
            {props.bibleStudy.person_data.person_name}
          </Typography>
        </Box>

        {props.selected && <IconCheck color="var(--accent-dark)" />}
      </Box>
    </MenuItem>
  );
};

export default BibleStudyItem;
