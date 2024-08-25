import { ReactNode, SyntheticEvent, useEffect, useState } from 'react';
import { Box, Tab, Tabs, tabsClasses } from '@mui/material';
import { CustomTabPanel } from '@components/tabs';
import { CustomTabProps } from '@components/tabs/index.types';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

/**
 * Component that renders scrollable tabs.
 *
 */
function ScrollableTabs({
  tabs,
  value,
  indicatorMode,
  onChange,
  className,
}: CustomTabProps) {
  const [valueOfActivePanel, setValueOfActivePanel] = useState(value || 0);

  /**
   * Handles tab change event.
   *
   * @param event The event object.
   * @param newValue The new value of the active tab.
   */
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    if (!indicatorMode) {
      event.preventDefault();
    }

    setValueOfActivePanel(newValue);
    onChange && onChange(newValue);
  };

  useEffect(() => {
    setValueOfActivePanel(value || 0);
  }, [value]);

  return (
    <Box sx={{ width: '100%', minHeight: '45px' }}>
      <Box>
        <Tabs
          value={valueOfActivePanel}
          onChange={handleChange}
          variant="scrollable"
          className={className}
          TabIndicatorProps={{
            hidden: !indicatorMode,
            sx: {
              backgroundColor: indicatorMode
                ? 'var(--accent-main)'
                : 'transparent',
              borderRadius: indicatorMode && '16px 16px 0px 0px',
              height: '4px',
            },
          }}
          slots={{
            EndScrollButtonIcon: ArrowForwardIosIcon,
            StartScrollButtonIcon: ArrowBackIosIcon,
          }}
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
            '& span.MuiTouchRipple-rippleVisible': {
              color: 'var(--accent-main)',
            },
            '& span.MuiTouchRipple-root': { borderRadius: 'var(--radius-max)' },
          }}
        >
          {tabs.map(
            ({ label, icon, className }, index): ReactNode => (
              <Tab
                label={label}
                key={index}
                className={className}
                icon={icon}
                iconPosition="end"
                sx={{
                  fontSize: 16,
                  textTransform: 'none',
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
        (tab, i: number): ReactNode => (
          <CustomTabPanel value={valueOfActivePanel} index={i} key={i}>
            {tab.Component}
          </CustomTabPanel>
        )
      )}
    </Box>
  );
}

export default ScrollableTabs;
