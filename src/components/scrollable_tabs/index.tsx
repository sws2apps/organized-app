import {
  Fragment,
  ReactNode,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react';
import { Box, Tab, Tabs, tabsClasses } from '@mui/material';
import { useBreakpoints } from '@hooks/index';
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
  variant = 'scrollable',
  minHeight = '48px',
  tabsCountOnScreen = 0,
  sx,
}: CustomTabProps) {
  const { tabletDown } = useBreakpoints();

  const [valueOfActivePanel, setValueOfActivePanel] = useState(value ?? false);

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
    onChange?.(newValue);
  };

  useEffect(() => {
    setValueOfActivePanel(value ?? false);
  }, [value]);

  return (
    <Box sx={{ width: '100%', minHeight: '45px' }}>
      <Box>
        <Tabs
          value={valueOfActivePanel}
          onChange={handleChange}
          variant={variant}
          scrollButtons={tabletDown ? false : 'auto'}
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
            '& .MuiSvgIcon-root g path': {
              fill: 'var(--accent-400)',
            },
            '& .Mui-selected > .MuiSvgIcon-root g path': {
              fill: 'var(--accent-dark)',
            },
            ...sx,
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
                  minHeight,
                  width:
                    tabsCountOnScreen !== 0
                      ? `calc(100% / ${tabsCountOnScreen})`
                      : 'auto',
                  fontSize: 16,
                  textTransform: 'none',
                  ':not(&.Mui-selected)': { fontWeight: 400 },
                  '&.Mui-Selected': {
                    fontWeight: 600,
                    fontSize: 18,
                  },
                }}
              />
            )
          )}
        </Tabs>
      </Box>

      {tabs.map(
        (tab, i: number): ReactNode => (
          <Fragment key={i}>
            {tab.Component && (
              <CustomTabPanel value={valueOfActivePanel} index={i}>
                {tab.Component}
              </CustomTabPanel>
            )}
          </Fragment>
        )
      )}
    </Box>
  );
}

export default ScrollableTabs;
