import { useState } from 'react';
import { Box, Tab, Tabs, tabsClasses } from '@mui/material';
import { CustomTabPanel } from '@components/tabs';
import { CustomTabProps } from '@components/tabs/index.types';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

/**
 * Component that renders scrollable tabs.
 *
 */
function ScrollableTabs({ tabs, selected, indicatorMode, onChange }: Readonly<CustomTabProps>) {
  const [valueOfActivePanel, setValueOfActivePanel] = useState(selected || 0);

  /**
   * Handles tab change event.
   *
   * @param event The event object.
   * @param newValue The new value of the active tab.
   */
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (!indicatorMode) {
      event.preventDefault();
      setValueOfActivePanel(newValue);
      onChange && onChange(newValue);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box>
        <Tabs
          value={valueOfActivePanel}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons
          TabIndicatorProps={{ hidden: true }}
          slots={{ EndScrollButtonIcon: ArrowForwardIosIcon, StartScrollButtonIcon: ArrowBackIosIcon }}
          aria-label="scrollable-auto-tabs"
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              color: 'var(--accent-main)',
              '&.Mui-disabled': { opacity: 0.3 },
            },
            '& button.Mui-selected': {
              color: 'var(--accent-main)',
              background: 'var(--accent-150)',
              borderRadius: 'var(--radius-max)',
            },
            '& button:not(.Mui-selected)': { color: 'var(--grey-350)' },
            // Programatically changing color of ripple (wave) when click happens:
            '& span.MuiTouchRipple-rippleVisible': { color: 'var(--accent-main)' },
            '& span.MuiTouchRipple-root': { borderRadius: 'var(--radius-max)' },
          }}
        >
          {tabs.map(
            ({ label, icon }): React.ReactNode => (
              <Tab
                label={label}
                key={label}
                icon={icon}
                iconPosition="end"
                sx={{
                  fontSize: 16,
                  textTransform: 'capitalize',
                  ':not(&.Mui-selected)': { fontWeight: 400 },
                  '&.Mui-Selected': {
                    fontWeight: 600,
                    fontSize: 18,
                  },
                  path: {
                    fill: 'var(--accent-main)',
                  },
                }}
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
}

export default ScrollableTabs;
