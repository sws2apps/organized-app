import { useEffect, useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { TabsPanelProps, CustomTabProps } from './index.types';

/**
 * A custom tab panel component.
 *
 * @param props The props for the TabsPanel component.
 */
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
      {value === index && <Box sx={{ padding: '24px 0' }}>{children}</Box>}
    </div>
  );
};

/**
 * Generate accessibility props for a tab.
 *
 * @param index The index of the tab.
 * @returns Accessibility props for the tab.
 */
const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

/**
 * A custom tabs component.
 *
 * @param tabs An array of tabs with label and corresponding component.
 */
const CustomTabs = ({ tabs, value, onChange }: CustomTabProps) => {
  const [valueOfActivePanel, setValueOfActivePanel] = useState(value);

  /**
   * Handle tab change event.
   *
   * @param event The event object.
   * @param newValue The new value of the active tab.
   */
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setValueOfActivePanel(newValue);

    onChange && onChange(newValue);
  };

  useEffect(() => {
    setValueOfActivePanel(value);
  }, [value]);

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

      {tabs.map(
        (tab, i: number): React.ReactNode => (
          <CustomTabPanel value={valueOfActivePanel} index={i} key={tab.label}>
            {tab.Component}
          </CustomTabPanel>
        )
      )}
    </Box>
  );
};

export default CustomTabs;
