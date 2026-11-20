import { Fragment, KeyboardEvent } from 'react';
import Divider from '@components/divider';
import { Box } from '@mui/material';
import { PreachingPartnerNavProps } from '@features/ministry/preaching_partner/requests_nav/index.types';
import { useAppTranslation } from '@hooks/index';
import usePreachingPartnerTabs from '@features/ministry/preaching_partner/requests_nav/usePreachingPartnerTabs';
import Card from '@components/card';
import SettingsTab from '@components/settings_tab';
import Typography from '@components/typography';

const PreachingPartnerNav = ({
  value,
  onChange,
  enableKeyboardNavigation = false,
}: PreachingPartnerNavProps) => {
  const { t } = useAppTranslation();

  const tabs = usePreachingPartnerTabs();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!enableKeyboardNavigation) return;

    const current = tabs.findIndex((tab) => tab.id === value);

    let next: number | undefined;

    if (e.key === 'ArrowDown') next = (current + 1) % tabs.length;
    if (e.key === 'ArrowUp') next = (current - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = tabs.length - 1;

    if (next === undefined) return;

    e.preventDefault();
    const buttons =
      e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]');
    buttons[next]?.focus();
    onChange(tabs[next].id);
  };

  return (
    <Card sx={{ alignSelf: 'flex-start', width: '100%' }}>
      <Typography className="h2">{t('tr_ministryRequests')}</Typography>

      <Box
        role={enableKeyboardNavigation ? 'tablist' : 'navigation'}
        aria-orientation={enableKeyboardNavigation ? 'vertical' : undefined}
        aria-label={t('tr_ministryRequests')}
        onKeyDown={handleKeyDown}
        sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
      >
        {tabs.map((tab, index) => (
          <Fragment key={tab.id}>
            <SettingsTab
              renderIcon={tab.renderIcon}
              label={tab.label}
              description={tab.description}
              active={value === tab.id}
              onClick={() => onChange(tab.id)}
              role={enableKeyboardNavigation ? 'tab' : undefined}
              aria-selected={
                enableKeyboardNavigation ? value === tab.id : undefined
              }
              aria-controls={
                enableKeyboardNavigation && value === tab.id
                  ? `preaching-partner-tabpanel-${tab.id}`
                  : undefined
              }
              id={`preaching-partner-tab-${tab.id}`}
              tabIndex={!enableKeyboardNavigation || value === tab.id ? 0 : -1}
            />

            {index < tabs.length - 1 && <Divider color="var(--accent-200)" />}
          </Fragment>
        ))}
      </Box>
    </Card>
  );
};

export default PreachingPartnerNav;
