import * as React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { TabsPanelProps, CustomTabProps } from './index.types';

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
          <Box>{children}</Box>
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

const CPETabs = ({ tabs }: CustomTabProps) => {
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
          {tabs.map(
            ({ label }, index: number): React.ReactNode => (
              <Tab
                label={label}
                key={label}
                className={`${valueOfActivePanel === index ? 'h4' : 'body-regular'}`}
                {...a11yProps(index)}
              />
            )
          )}
        </Tabs>
      </Box>
      <Box display="flex" justifyContent="center">
        {tabs.map(
          (tab, i: number): React.ReactNode => (
            <CustomTabPanel value={valueOfActivePanel} index={i} key={tab.label}>
              {tab.Component}
            </CustomTabPanel>
          )
        )}
      </Box>
    </Box>
  );
};

export default CPETabs;
