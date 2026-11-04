import { useAppTranslation } from '@hooks/index';
import { useState } from 'react';
import { Box, MenuItem, Stack } from '@mui/material';
import { useNavigate } from 'react-router';
import { useAtomValue } from 'jotai';
import {
  Button,
  CustomDivider,
  FilterChip,
  InfoNote,
  Select,
  Typography,
} from '@components/index';
import DatePicker from '@components/date_picker';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import { appLocaleState } from '@states/app';
import { territoryLocalModeState } from '@states/territories';
import { Territory, TerritoryType, TYPE_LABEL } from '@definition/territory';
import { displaySnackNotification } from '@services/states/app';
import { ChartCard } from '@features/territories/components/charts';
import TruncatedText from '@features/territories/components/truncated_text';
import { territoryCampaignsState } from '@features/territories/campaigns';
import {
  campaignChoices,
  campaignLabel,
  campaignRange,
  dateOf,
  dayOf,
} from '@features/territories/campaign_dates';
import { assignmentIssues, toStoredDate } from '@features/territories/helpers';
import {
  campaignEnded,
  campaignProgress,
  currentCampaign,
  outForCampaign,
} from '@features/territories/campaign_filter';
import useAssignReturn from '@features/territories/useAssignReturn';
import { holderText } from '@features/territories/group_holder';
import { PublisherPicker } from '@features/territories/components/holder_picker';

const CampaignCard = ({ territories }: { territories: Territory[] }) => {
  const { t } = useAppTranslation();

  const navigate = useNavigate();

  const campaigns = useAtomValue(territoryCampaignsState);
  const locale = useAtomValue(appLocaleState);
  const localMode = useAtomValue(territoryLocalModeState);

  const actions = useAssignReturn();

  const [picked, setPicked] = useState<string>();
  const [types, setTypes] = useState<TerritoryType[]>([]);
  // set while "Return all" waits for its date
  const [returnOn, setReturnOn] = useState<Date | null>();
  const [returnedBy, setReturnedBy] = useState('');

  const choices = campaignChoices(campaigns, new Date());
  const campaign =
    choices.find((item) => item.id === picked) ??
    currentCampaign(campaigns) ??
    choices[0];

  if (!campaign) {
    return (
      <ChartCard title={t('tr_specialCampaignWeek')} span={4}>
        <InfoNote
          message={
            localMode
              ? t(
                  'tr_territorySpecialCampaignsAreEnteredUnderSettingsSpecialCampaigns'
                )
              : t(
                  'tr_territorySpecialCampaignsComeFromTheUpcomingEventsPageAdd'
                )
          }
        />
      </ChartCard>
    );
  }

  const shown = types.length
    ? territories.filter((territory) => types.includes(territory.type))
    : territories;

  const progress = campaignProgress(shown, campaign.id);

  const rows = [
    {
      label: 'tr_territoryWorked',
      value: progress.worked,
      color: 'var(--green-main)',
    },
    {
      label: 'tr_territoryOut',
      value: progress.out,
      color: 'var(--orange-main)',
    },
    {
      label: 'tr_territoryNotYetAssigned',
      value: progress.waiting,
      color: 'var(--accent-300)',
    },
  ];

  const stillOut = shown.flatMap((territory) => {
    const open = outForCampaign(territory, campaign.id);

    return open && campaignEnded(open, campaigns) ? [{ territory, open }] : [];
  });

  // only one person to check when they all hold the same
  const heldBy = new Set(stillOut.map(({ open }) => open.publisher));
  const sharedBy = heldBy.size === 1 ? [...heldBy][0] : '';

  const returnIssues = returnOn
    ? stillOut.flatMap(({ open }) =>
        assignmentIssues({
          assignedOn: open.assignedOn,
          returnedOn: toStoredDate(returnOn),
        })
      )
    : [];
  const returnTooEarly = returnIssues.includes('returned_before_assigned');
  const returnFuture = returnIssues.includes('returned_future');

  const toggleType = (type: TerritoryType) =>
    setTypes(
      types.includes(type)
        ? types.filter((item) => item !== type)
        : [...types, type]
    );

  const shareSummary = async () => {
    const text = `${campaign.name} (${campaignRange(campaign, locale.code)}): ${t('tr_territoryOfTerritoriesWorkedOutNotYetAssigned', progress)}`;

    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);

        displaySnackNotification({
          header: t('tr_territorySummaryCopied'),
          message: text,
          severity: 'success',
        });
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        displaySnackNotification({
          header: t('tr_territorySharingFailed'),
          message: t((error as Error).message, {
            defaultValue: t(
              'tr_territoryTheCampaignReportCouldNotBeSharedTryAgain'
            ),
          }),
          severity: 'error',
        });
      }
    }
  };

  let returnDateHint = '';
  if (returnTooEarly)
    returnDateHint = t('tr_territoryCannotBeBeforeTheAssignedDate');
  else if (returnFuture)
    returnDateHint = t('tr_territoryThisDateIsInTheFuture');

  return (
    <ChartCard
      title={t('tr_territoryCampaignProgress')}
      hint={campaignLabel(campaign, locale.code)}
      note={t('tr_territoryAsOfToday')}
      span={4}
      action={
        <Button
          variant="small"
          disableAutoStretch
          minHeight={32}
          onClick={shareSummary}
        >
          {t('tr_territoryShareSummary')}
        </Button>
      }
    >
      {choices.length > 1 && (
        <Select
          label={t('tr_specialCampaignWeek')}
          value={campaign.id}
          onChange={(event) => setPicked(String(event.target.value))}
        >
          {choices.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              <Typography className="body-regular">
                {campaignLabel(item, locale.code)}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      )}

      <Typography className="h2" color="var(--black)">
        {t('tr_territoryOfCovered', {
          covered: progress.worked,
          total: progress.total,
        })}
      </Typography>

      <Stack direction="row" spacing="4px" sx={{ height: '20px' }}>
        {rows.map((row) => (
          <Box
            key={row.label}
            title={`${t(row.label)}: ${row.value}`}
            sx={{
              flexGrow: row.value || 0.02,
              borderRadius: 'var(--radius-s)',
              backgroundColor: row.color,
            }}
          />
        ))}
      </Stack>

      <Stack spacing="8px">
        {rows.map((row) => (
          <Stack
            key={row.label}
            direction="row"
            spacing="8px"
            sx={{ alignItems: 'center' }}
          >
            <Box
              sx={{
                width: '10px',
                height: '10px',
                borderRadius: 'var(--radius-max)',
                backgroundColor: row.color,
              }}
            />
            <Typography className="body-small-regular" color="var(--black)">
              {t(row.label)}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Typography className="body-small-semibold" color="var(--black)">
              {row.value}
            </Typography>
          </Stack>
        ))}
      </Stack>

      {/* narrows the view only; the campaign itself stays the same */}
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: '8px' }}>
        {(Object.keys(TYPE_LABEL) as TerritoryType[]).map((type) => (
          <FilterChip
            key={type}
            label={t(TYPE_LABEL[type])}
            selected={types.includes(type)}
            onClick={() => toggleType(type)}
          />
        ))}
      </Stack>

      {stillOut.length > 0 && (
        <Stack spacing="8px">
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
            }}
          >
            <Typography className="body-small-semibold" color="var(--black)">
              {t('tr_territoryStillOutAfterTheEnd')}
            </Typography>
            <Button
              variant="small"
              disableAutoStretch
              onClick={() => {
                setReturnedBy(sharedBy);
                setReturnOn(
                  campaign.end < dayOf(new Date())
                    ? dateOf(campaign.end)
                    : new Date()
                );
              }}
            >
              {t('tr_territoryReturnAll')}
            </Button>
          </Stack>

          <Stack
            spacing="2px"
            divider={<CustomDivider color="var(--accent-200)" />}
          >
            {stillOut.map(({ territory, open }) => (
              <Stack
                key={territory.id}
                direction="row"
                spacing="12px"
                onClick={() =>
                  navigate(`/territories/${territory.id}`, {
                    state: {
                      parent: 'tr_territoryTerritoryCoverageStatistics',
                    },
                  })
                }
                sx={{
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: 'var(--radius-m)',
                  '&:hover': { backgroundColor: 'var(--accent-100)' },
                }}
              >
                <Typography
                  className="body-small-semibold"
                  color="var(--black)"
                  sx={{ width: '40px', flexShrink: 0 }}
                >
                  {territory.number}
                </Typography>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <TruncatedText
                    className="body-small-regular"
                    text={territory.name}
                  />
                  <TruncatedText
                    className="label-small-regular"
                    color="var(--grey-350)"
                    text={holderText(open)}
                  />
                </Box>
              </Stack>
            ))}
          </Stack>
        </Stack>
      )}

      {returnOn !== undefined && (
        <Dialog
          onClose={() => setReturnOn(undefined)}
          open
          title={t('tr_territoryReturnAll')}
          description={t(
            'tr_territoryTheTerritoriesStillOutForThisCampaignAreReturned'
          )}
        >
          {sharedBy && (
            <PublisherPicker
              label={t('tr_territoryReturnedBy')}
              value={returnedBy}
              onChange={setReturnedBy}
              current={sharedBy}
            />
          )}

          <DatePicker
            label={t('tr_territoryReturnedOn')}
            value={returnOn}
            error={returnTooEarly || returnFuture}
            helperText={returnDateHint}
            onChange={(value) => setReturnOn(value)}
          />

          <DialogActions>
            <Button variant="secondary" onClick={() => setReturnOn(undefined)}>
              {t('tr_cancel')}
            </Button>
            <Button
              variant="main"
              disabled={!returnOn || returnTooEarly || returnFuture}
              onClick={() => {
                if (!returnOn) return;
                actions.returnMany(
                  stillOut.map(({ territory }) => territory.id),
                  returnOn,
                  sharedBy && returnedBy && returnedBy !== sharedBy
                    ? returnedBy
                    : undefined
                );
                setReturnOn(undefined);
              }}
            >
              {t('tr_return')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </ChartCard>
  );
};

export default CampaignCard;
