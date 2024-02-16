import * as React from 'react';
import { Tabs, Tab, Typography, Box } from '@mui/material';
import { TabsPanelProps } from './index.types';

const tabsLabels: string[] = ['Midweek meeting', 'Weekend meeting', 'Another one...'];

const CustomTabPanel = (props: TabsPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const CPETabs = () => {
  const [valueOfActivePanel, setValueOfActivePanel] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setValueOfActivePanel(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box>
        <Tabs
          value={valueOfActivePanel}
          onChange={handleChange}
          TabIndicatorProps={{
            sx: {
              backgroundColor: 'var(--accent-main)',
              height: '4px',
              borderRadius: '16px 16px 0 0',
            },
          }}
          sx={{
            '& button.Mui-selected': { color: 'var(--accent-main)' },
            '& button:not(.Mui-selected)': { color: 'var(--grey-350)' },
            // Programatically changing color of ripple (wave) when click happens:
            '& span.MuiTouchRipple-rippleVisible': { color: 'var(--accent-main)' },
          }}
        >
          {tabsLabels.map((label, index) => (
            <Tab
              key={label}
              label={label}
              className={`${valueOfActivePanel === index ? 'h4' : 'body-regular'}`}
              {...a11yProps(index)}
            ></Tab>
          ))}
        </Tabs>
      </Box>
      <CustomTabPanel value={valueOfActivePanel} index={0}>
        Content of midweek meeting
      </CustomTabPanel>
      <CustomTabPanel value={valueOfActivePanel} index={1}>
        Content of weekend meeting
      </CustomTabPanel>
      <CustomTabPanel value={valueOfActivePanel} index={2}>
        Content of other meeting
      </CustomTabPanel>
    </Box>
  );
};

export default CPETabs;
