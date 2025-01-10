import { ReactNode, SyntheticEvent, useEffect, useState } from 'react';
import { Tabs as MUITabs, Tab, Box } from '@mui/material';
import { TabsPanelProps, CustomTabProps } from './index.types';

/**
 * A custom tab panel component.
 *
 * @param props The props for the TabsPanel component.
 */
export const CustomTabPanel = (props: TabsPanelProps) => {
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
const Tabs = ({ tabs, value, onChange }: CustomTabProps) => {
  const [valueOfActivePanel, setValueOfActivePanel] = useState(value || 0);

  /**
   * Handle tab change event.
   *
   * @param event The event object.
   * @param newValue The new value of the active tab.
   */
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setValueOfActivePanel(newValue);

    onChange?.(newValue);
  };

  useEffect(() => {
    setValueOfActivePanel(value || 0);
  }, [value]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box>
        <MUITabs
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
            '& button.Mui-selected': {
              color: 'var(--accent-main)',
            },
            '& button:not(.Mui-selected)': {
              color: 'var(--grey-350)',
            },
            // Programatically changing color of ripple (wave) when click happens:
            '& span.MuiTouchRipple-rippleVisible': {
              color: 'var(--accent-main)',
            },

            '& button': {
              borderRadius: 'var(--radius-l)',
            },
          }}
        >
          {tabs.map(
            ({ label, className }, index): ReactNode => (
              <Tab
                label={label}
                key={index}
                className={`${valueOfActivePanel === index ? 'h4' : 'body-regular'} ${className}`}
                {...a11yProps(index)}
              />
            )
          )}
        </MUITabs>
      </Box>

      {tabs.map(
        (tab, i: number): ReactNode => (
          <CustomTabPanel value={valueOfActivePanel} index={i} key={i}>
            {tab.Component}
          </CustomTabPanel>
        )
      )}
    </Box>
  );
};

export default Tabs;
