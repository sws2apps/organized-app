import Select from '@components/select';
import { SelectPublishersProps } from './index.types';
import MenuItem from '@components/menuitem';
import { useAppTranslation } from '@hooks/index';
import Typography from '@components/typography';
import { Box } from '@mui/material';
import useSelectPublishers from './useSelectPublishers';

const SelectPublishers = (props: SelectPublishersProps) => {
  const { t } = useAppTranslation();
  const { groups } = useSelectPublishers();
  return (
    <Select
      label={t('tr_publishers')}
      value={props.value}
      onChange={props.onChange}
    >
      <MenuItem key={'all-publishers'} value={'all'}>
        {t('tr_allPublisherRecords')}
      </MenuItem>
      <Box
        sx={{
          borderBottom: '1px solid var(--accent-200)',
          padding: '16px 16px 8px 16px',
        }}
      >
        <Typography className="body-small-semibold" color="var(--accent-dark)">
          {t('tr_groups')}
        </Typography>
      </Box>
      {groups.map((group) => (
        <MenuItem key={group.id} value={group.id}>
          {group.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default SelectPublishers;
