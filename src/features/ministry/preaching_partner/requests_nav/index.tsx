import { Fragment, KeyboardEvent } from 'react';
import { Box, Divider } from '@mui/material';
import { PreachingPartnerNavProps } from './index.types';
import { useAppTranslation } from '@hooks/index';
import usePreachingPartnerTabs from './usePreachingPartnerTabs';
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
    onChange(tabs[next].id);
  };

  return (
    <Card sx={{ alignSelf: 'flex-start', width: '100%' }}>
      <Typography className="h2">{t('tr_ministryRequests')}</Typography>

      <Box
        role="tablist"
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
              role="tab"
              aria-selected={value === tab.id}
              aria-controls={`preaching-partner-tabpanel-${tab.id}`}
              id={`preaching-partner-tab-${tab.id}`}
              tabIndex={!value || value === tab.id ? 0 : -1}
            />

            {index < tabs.length - 1 && (
              <Divider sx={{ borderColor: 'var(--accent-200)' }} />
            )}
          </Fragment>
        ))}
      </Box>
    </Card>
  );
};

export default PreachingPartnerNav;
