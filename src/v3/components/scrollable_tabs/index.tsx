import { CustomTabProps } from '@components/tabs/index.types';
import { Box, Tab, Tabs, tabsClasses } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import React, { useState } from 'react';

/**
 * Component that renders scrollable tabs.
 *
 * @param tabs Array of tab labels.
 */
function ScrollableTabs({ tabs }: CustomTabProps) {
  const [valueOfActivePanel, setValueOfActivePanel] = useState(0);

  /**
   * Handles tab change event.
   *
   * @param event The event object.
   * @param newValue The new value of the active tab.
   */
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setValueOfActivePanel(newValue);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        maxWidth: 640,
      }}
    >
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
          ({ label }): React.ReactNode => (
            <Tab
              label={label}
              key={label}
              sx={{
                fontSize: 16,
                ':not(&.Mui-selected)': { fontWeight: 400 },
                '&.Mui-Selected': { fontWeight: 600, fontSize: 18 },
              }}
            />
          )
        )}
      </Tabs>
    </Box>
  );
}

export default ScrollableTabs;
