import { ReactNode } from 'react';
import { Box, Stack } from '@mui/material';
import { ScrollableTabs, Typography } from '@components/index';
import Card from '@components/card';
import { useBreakpoints } from '@hooks/index';
import { Territory } from '@definition/territory';
import { daysLabel, withAssignments } from '../helpers';
import TerritorySummary from '../components/territory_summary';
import DetailsForm from './details_form';
import DoNotCallPanel from './do_not_call_panel';
import TerritoryAssignments from './territory_assignments';
import TerritoryMap from './territory_map';
import PhoneNumbersPanel from './phone_numbers_panel';
import TerritoryStats from './territory_stats';

type TerritoryDetailsProps = {
  territory: Territory;
  onChange: (territory: Territory) => void;
  // publishers see the territory to decide on a request, but don't edit it
  readOnly?: boolean;
  // do-not-call addresses and phone numbers stay with admins and the holder
  showPrivate?: boolean;
};

type Section = { label: string; badge?: number; Component: ReactNode };

const TabbedSections = ({ sections }: { sections: Section[] }) => (
  <Box sx={{ '& [role="tabpanel"] > *': { padding: '16px 0 0' } }}>
    <ScrollableTabs
      appearance="plain"
      tabs={sections}
      value={0}
      sx={{ borderBottom: '1px solid var(--accent-200)' }}
    />
  </Box>
);

const TerritoryDetails = ({
  territory,
  onChange,
  readOnly = false,
  showPrivate = true,
}: TerritoryDetailsProps) => {
  const { desktopUp } = useBreakpoints();

  const summary = (
    <>
      <TerritorySummary
        heading
        territory={territory}
        meta={
          !readOnly && territory.holder
            ? `${territory.holder} · out ${daysLabel(territory.daysOut)}`
            : undefined
        }
      />

      <TerritoryStats territory={territory} showDoNotCalls={showPrivate} />
    </>
  );

  const form = (
    <DetailsForm key={territory.id} territory={territory} onChange={onChange} />
  );

  const isPhone = territory.type === 'phone';

  const map = isPhone ? (
    <PhoneNumbersPanel
      territory={territory}
      onChange={(next) => onChange({ ...territory, phoneNumbers: next })}
    />
  ) : (
    <TerritoryMap territory={territory} />
  );

  const mapLabel = isPhone ? 'Phone numbers' : 'Territory map';

  const assignments = (
    <TerritoryAssignments
      territory={territory}
      onChange={(next) => onChange(withAssignments(territory, next))}
    />
  );

  const doNotCalls = (
    <DoNotCallPanel
      territory={territory}
      onChange={(next) => onChange({ ...territory, doNotCalls: next })}
    />
  );

  if (readOnly) {
    const sections = [
      ...(isPhone
        ? showPrivate
          ? [
              {
                label: 'Phone numbers',
                badge: territory.phoneNumbers?.length ?? 0,
                Component: (
                  <PhoneNumbersPanel
                    territory={territory}
                    onChange={() => {}}
                    readOnly
                  />
                ),
              },
            ]
          : []
        : [
            {
              label: 'Map',
              Component: <TerritoryMap territory={territory} readOnly />,
            },
          ]),
      ...(showPrivate
        ? [
            {
              label: 'Do not call',
              badge: territory.doNotCalls.length,
              Component: (
                <DoNotCallPanel
                  territory={territory}
                  onChange={() => {}}
                  readOnly
                />
              ),
            },
          ]
        : []),
    ];

    return (
      <Card>
        {summary}

        {sections.length > 0 && <TabbedSections sections={sections} />}
      </Card>
    );
  }

  if (!desktopUp) {
    return (
      <Card>
        {summary}

        <TabbedSections
          sections={[
            { label: 'Details', Component: form },
            { label: isPhone ? 'Phone numbers' : 'Map', Component: map },
            { label: 'Assignments', Component: assignments },
            {
              label: 'Do not call',
              badge: territory.doNotCalls.length,
              Component: doNotCalls,
            },
          ]}
        />
      </Card>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        gap: '16px',
        alignItems: 'start',
      }}
    >
      <Stack spacing="16px">
        <Card>
          <Typography className="h2" color="var(--black)">
            Territory details
          </Typography>
          {form}
        </Card>

        <Card>
          <Typography className="h2" color="var(--black)">
            {isPhone ? 'Do-not-call numbers' : 'Do-not-call addresses'}
          </Typography>
          {doNotCalls}
        </Card>
      </Stack>

      <Card>
        {summary}

        <TabbedSections
          sections={[
            { label: mapLabel, Component: map },
            { label: 'Assignments', Component: assignments },
          ]}
        />
      </Card>
    </Box>
  );
};

export default TerritoryDetails;
