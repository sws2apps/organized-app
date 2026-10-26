import CampaignProgressCounts from '@features/territories/components/campaign_progress/counts';
import { Box, Stack, useMediaQuery, useTheme } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router';
import Accordion from '@components/accordion';
import Button from '@components/button';
import Card from '@components/card';
import Badge from '@components/badge';
import Tooltip from '@components/tooltip';
import IconButton from '@components/icon_button';
import ScrollableTabs from '@components/scrollable_tabs';
import Typography from '@components/typography';
import { IconEdit } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import { appLocaleState } from '@states/app';
import { TerritoryCampaign } from '@definition/territory';
import { campaignRange, dayOf } from '@features/territories/campaign_dates';
import { campaignStartsIn } from '@features/territories/campaign_view';
import { HOVER_ACTIONS } from '@features/territories/components/table_styles';
import CampaignProgress from '@features/territories/components/campaign_progress';
import useCampaignOverview from '@features/territories/components/campaign_overview/useCampaignOverview';

const CampaignOverview = ({
  onEdit,
  editableIds,
}: {
  onEdit?: (campaign: TerritoryCampaign) => void;
  editableIds?: string[];
}) => {
  const { t } = useAppTranslation();
  const locale = useAtomValue(appLocaleState);
  const navigate = useNavigate();
  const view = useCampaignOverview();
  const theme = useTheme();
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const today = dayOf(new Date());
  const showTerritories = (id: string, assign = false) =>
    navigate(
      `/territories?tab=${view.context.access === 'own' && !view.context.editor ? 'mine' : 'campaign'}&campaign=${encodeURIComponent(id)}${assign ? '&campaignStatus=waiting' : ''}`
    );

  return (
    <Card sx={{ gap: 0 }}>
      <ScrollableTabs
        appearance="plain"
        value={view.past ? 1 : 0}
        onChange={view.setPeriod}
        tabs={[
          { label: t('tr_territoryCampaignActive') },
          { label: t('tr_territoryCampaignPast') },
        ]}
      />
      {view.missing && (
        <Typography color="var(--grey-400)">
          {t('tr_territoryCampaignNotFound')}
        </Typography>
      )}
      {view.items.map((campaign, index) => {
        const past = campaign.end < today;
        const upcoming = campaign.start > today;
        const featured = !view.past && index === 0;
        const editable =
          onEdit && (!editableIds || editableIds.includes(campaign.id));
        const panelId = `campaign-${campaign.id}`;
        return (
          <Box
            key={campaign.id}
            sx={{
              ...HOVER_ACTIONS,
              position: 'relative',
              paddingBlock: '16px',
              borderTop: index ? '1px solid var(--accent-200)' : undefined,
            }}
          >
            <Accordion
              id={panelId}
              expanded={view.expandedId === campaign.id}
              onChange={(value) => view.open(value ? campaign.id : undefined)}
              slotProps={{
                transition: {
                  unmountOnExit: true,
                  timeout: reducedMotion
                    ? 0
                    : theme.transitions.duration.standard,
                },
              }}
              detailsProps={{
                sx: {
                  padding: 0,
                  paddingTop: '16px',
                  paddingInlineStart: { mobile: 0, tablet: '56px' },
                },
              }}
              summaryProps={{
                id: `${panelId}-header`,
                'aria-label': campaign.name,
                'aria-controls': `${panelId}-content`,
                sx: {
                  '& .MuiAccordionSummary-expandIconWrapper': {
                    alignSelf: 'flex-start',
                    width: '44px',
                    height: '44px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...(reducedMotion && { transition: 'none' }),
                  },
                  '& .MuiAccordionSummary-content': {
                    minWidth: 0,
                    margin: '0 !important',
                  },
                },
              }}
              label={
                <CampaignProgress
                  campaignId={campaign.id}
                  compact
                  showCounts={false}
                  heading={
                    <Stack
                      spacing="4px"
                      sx={{ paddingRight: editable ? '52px' : '8px' }}
                    >
                      <Typography
                        component="span"
                        className={featured ? 'h2' : 'h3'}
                        sx={{ overflowWrap: 'anywhere' }}
                      >
                        {campaign.name}
                      </Typography>
                      <Stack
                        direction="row"
                        sx={{
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '8px',
                        }}
                      >
                        <Typography
                          className="label-small-regular"
                          color="var(--grey-400)"
                        >
                          {campaignRange(campaign, locale.code)}
                        </Typography>
                        <Badge
                          size="small"
                          color={past ? 'grey' : 'accent'}
                          multiLine
                          sx={{ maxWidth: '100%', flexShrink: 1 }}
                          text={
                            past
                              ? t('tr_territoryCampaignPast')
                              : upcoming
                                ? t('tr_territoryCampaignStartsIn', {
                                    count: campaignStartsIn(campaign),
                                  })
                                : t('tr_territoryCampaignActive')
                          }
                        />
                      </Stack>
                    </Stack>
                  }
                />
              }
            >
              <Stack spacing="16px">
                <CampaignProgressCounts campaignId={campaign.id} />
                {campaign.description && (
                  <Typography
                    className="body-small-regular"
                    sx={{ whiteSpace: 'pre-line', overflowWrap: 'anywhere' }}
                  >
                    {campaign.description}
                  </Typography>
                )}

                <Stack
                  direction="row"
                  sx={{
                    justifyContent: 'flex-end',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <Button
                    variant="small"
                    disableAutoStretch
                    onClick={() => showTerritories(campaign.id)}
                  >
                    {t('tr_territoryCampaignTerritories')}
                  </Button>
                  {view.context.editor && !past && (
                    <Button
                      variant="small"
                      disableAutoStretch
                      onClick={() => showTerritories(campaign.id, true)}
                    >
                      {t('tr_territoryAssignTerritories')}
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Accordion>
            {editable && (
              <Tooltip title={t('tr_territoryEditCampaign')}>
                <IconButton
                  className="row-actions"
                  edge={false}
                  aria-label={`${t('tr_territoryEditCampaign')}: ${campaign.name}`}
                  onClick={() => onEdit(campaign)}
                  sx={{
                    position: 'absolute',
                    top: '16px',
                    right: '52px',
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-l)',
                    '.MuiTouchRipple-ripple .MuiTouchRipple-child': {
                      borderRadius: 'var(--radius-l)',
                    },
                  }}
                >
                  <IconEdit color="var(--accent-dark)" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        );
      })}
      {!view.items.length && (
        <Typography color="var(--grey-400)">
          {t('tr_territoryCampaignsEmpty')}
        </Typography>
      )}
    </Card>
  );
};
export default CampaignOverview;
