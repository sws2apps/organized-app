import { Box, ButtonBase } from '@mui/material';
import { IconChevronRight, IconGroups, IconRaiseHand } from '@components/icons';
import { PreachingPartnerNavProps } from './index.types';
import { PreachingPartnerTab } from '@definition/preaching_partner';
import { useAppTranslation } from '@hooks/index';
import Card from '@components/card';
import Divider from '@components/divider';
import Typography from '@components/typography';

const PreachingPartnerNav = ({ value, onChange }: PreachingPartnerNavProps) => {
  const { t } = useAppTranslation();

  const tabs: {
    key: PreachingPartnerTab;
    title: string;
    description: string;
    Icon: typeof IconRaiseHand;
  }[] = [
    {
      key: 'mine',
      title: t('tr_myPartnerRequests'),
      description: t('tr_myPartnerRequestsDesc'),
      Icon: IconRaiseHand,
    },
    {
      key: 'congregation',
      title: t('tr_congregationPartnerRequests'),
      description: t('tr_congregationPartnerRequestsDesc'),
      Icon: IconGroups,
    },
  ];

  return (
    <Card sx={{ gap: '8px', height: 'fit-content' }}>
      <Typography className="h3">{t('tr_ministryRequests')}</Typography>

      <Box
        role="tablist"
        aria-label={t('tr_ministryRequests')}
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        {tabs.map((tab, index) => {
          const selected = tab.key === value;

          const color = selected ? 'var(--accent-dark)' : 'var(--black)';

          return (
            <Box key={tab.key}>
              {index > 0 && <Divider color="var(--accent-200)" />}

              <ButtonBase
                disableRipple
                role="tab"
                aria-selected={selected}
                onClick={() => onChange(tab.key)}
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 12px',
                  textAlign: 'start',
                  borderRadius: 'var(--radius-s)',
                  // the active tab is marked by a bar on its leading edge
                  borderInlineStart: `4px solid ${
                    selected ? 'var(--accent-main)' : 'transparent'
                  }`,
                  backgroundColor: selected ? 'var(--accent-150)' : 'unset',
                  '&:hover': {
                    backgroundColor: selected
                      ? 'var(--accent-150)'
                      : 'var(--accent-100)',
                  },
                }}
              >
                <tab.Icon color={color} />

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography className="h4" color={color}>
                    {tab.title}
                  </Typography>
                  <Typography
                    className="label-small-regular"
                    color="var(--grey-350)"
                  >
                    {tab.description}
                  </Typography>
                </Box>

                {selected && <IconChevronRight color="var(--accent-dark)" />}
              </ButtonBase>
            </Box>
          );
        })}
      </Box>
    </Card>
  );
};

export default PreachingPartnerNav;
