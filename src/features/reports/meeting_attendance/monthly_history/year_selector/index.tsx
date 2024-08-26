import { Box } from '@mui/material';
import { useBreakpoints } from '@hooks/index';
import { YearSelectorProps } from './index.types';
import useYearSelector from './useYearSelector';
import ScrollableTabs from '@components/scrollable_tabs';

const YearSelector = ({ onChange, value }: YearSelectorProps) => {
  const { tabs } = useYearSelector();

  const { tabletUp } = useBreakpoints();

  return (
    <Box sx={{ padding: '0px 8px' }}>
      <ScrollableTabs
        variant={tabletUp ? 'fullWidth' : 'scrollable'}
        tabs={tabs}
        value={value}
        onChange={onChange}
      />
    </Box>
  );
};

export default YearSelector;
