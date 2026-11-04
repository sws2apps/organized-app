import { currentAssignmentNote } from '@features/territories/notes';
import TerritoryNote from '@features/territories/components/note';
import { ReactNode, useRef, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { ScrollableTabs, Typography } from '@components/index';
import Card from '@components/card';
import InfoBanner from '@components/info_banner';
import { IconCancelCicle } from '@icons/index';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { DoNotCall, Territory } from '@definition/territory';
import { daysLabel, withAssignments } from '@features/territories/helpers';
import TerritorySummary from '@features/territories/components/territory_summary';
import AssignedTwice from '@features/territories/details/assigned_twice';
import DetailsForm from '@features/territories/details/details_form';
import DoNotCallPanel from '@features/territories/details/do_not_call_panel';
import TerritoryAssignments from '@features/territories/details/territory_assignments';
import TerritoryMap from '@features/territories/details/territory_map';
import PhoneNumbersPanel from '@features/territories/details/phone_numbers_panel';
import TerritoryStats from '@features/territories/details/territory_stats';
import {
  missingPublisher,
  territoryHolderText,
} from '@features/territories/group_holder';

type TerritoryDetailsProps = {
  territory: Territory;
  onChange: (territory: Territory) => void;
  // a new territory is saved once its number is typed in full
  onCommit?: VoidFunction;
  // a new territory starts where its number goes
  openOnDetails?: boolean;
  // publishers see the territory to decide on a request, but don't edit it
  readOnly?: boolean;
  // do-not-call addresses and phone numbers stay with admins and the holder
  showPrivate?: boolean;
  // the publisher working the territory adds the do-not-calls they meet
  heldByMe?: boolean;
};

type Section = { label: string; badge?: number; Component: ReactNode };

const TabbedSections = ({
  sections,
  start = 0,
}: {
  sections: Section[];
  start?: number;
}) => (
  <Box sx={{ '& [role="tabpanel"] > *': { padding: '16px 0 0' } }}>
    <ScrollableTabs
      appearance="plain"
      tabs={sections}
      value={start}
      sx={{ borderBottom: '1px solid var(--accent-200)' }}
    />
  </Box>
);

const TerritoryDetails = ({
  territory,
  onChange,
  onCommit,
  openOnDetails = false,
  readOnly = false,
  showPrivate = true,
  heldByMe = false,
}: TerritoryDetailsProps) => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  // kept from the first render, so saving the new territory doesn't switch tabs
  const [startOnDetails] = useState(openOnDetails);

  const doNotCallRef = useRef<HTMLDivElement>(null);

  const showDoNotCallList = () =>
    doNotCallRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

  const holder = territoryHolderText(territory);

  const summary = (
    <>
      <TerritorySummary
        heading
        territory={territory}
        showDoNotCalls={showPrivate}
        onDoNotCalls={showDoNotCallList}
        meta={
          !readOnly && holder
            ? `${holder} · ${daysLabel(territory.daysOut)}`
            : undefined
        }
        holder={readOnly ? undefined : holder}
      />

      {showPrivate && (
        <TerritoryNote kind="territory" value={territory.notes} />
      )}

      {showPrivate && (
        <TerritoryNote
          kind="assignment"
          value={currentAssignmentNote(territory)}
        />
      )}

      <TerritoryStats territory={territory} />

      {!readOnly && <AssignedTwice territory={territory} onChange={onChange} />}

      {!readOnly &&
        territory.status !== 'available' &&
        missingPublisher({
          publisher: territory.holder,
          group: territory.holderGroup,
        }) && (
          <InfoBanner sx={{ width: '100%' }}>
            {t('tr_territoryOutForButNobodyIsNamedAsHavingIt', {
              group: territory.holderGroup,
            })}
          </InfoBanner>
        )}
    </>
  );

  const form = (
    <DetailsForm
      key={territory.id}
      territory={territory}
      onChange={onChange}
      onCommit={onCommit}
    />
  );

  const isPhone = territory.type === 'phone';

  const changeDoNotCalls = (next: DoNotCall[]) =>
    onChange({ ...territory, doNotCalls: next });

  const mapContent = isPhone ? (
    <PhoneNumbersPanel
      territory={territory}
      onChange={(next) => onChange({ ...territory, phoneNumbers: next })}
    />
  ) : (
    <TerritoryMap territory={territory} />
  );

  const map = <Stack spacing="12px">{mapContent}</Stack>;

  const mapLabel = isPhone
    ? t('tr_territoryPhoneNumbers')
    : t('tr_territoryTerritoryMap');

  const assignments = (
    <TerritoryAssignments
      territory={territory}
      onChange={(next) => onChange(withAssignments(territory, next))}
      onNotes={(notes) => onChange({ ...territory, notes })}
    />
  );

  const doNotCalls = (
    <DoNotCallPanel territory={territory} onChange={changeDoNotCalls} />
  );

  const doNotCallCard = (content: ReactNode) => (
    // clears the fixed top bar when the overview badge scrolls here
    <Card ref={doNotCallRef} sx={{ scrollMarginTop: '96px' }}>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          gap: 'var(--radius-l)',
          padding: 'var(--radius-xl)',
          borderRadius: 'var(--radius-l)',
          backgroundColor: 'var(--red-secondary)',
        }}
      >
        <IconCancelCicle color="var(--red-dark)" />
        <Typography className="h2" color="var(--red-dark)">
          {t('tr_territoryDoNotCallLabel')}
        </Typography>
      </Stack>
      {content}
    </Card>
  );

  const doNotCallAccess = heldByMe ? ('own' as const) : ('none' as const);
  const initialTab = startOnDetails ? 2 : 0;

  if (readOnly) {
    const content = isPhone ? (
      showPrivate && (
        <PhoneNumbersPanel territory={territory} onChange={() => {}} readOnly />
      )
    ) : (
      <TerritoryMap
        territory={territory}
        readOnly
        showDoNotCalls={showPrivate}
      />
    );

    return (
      <Stack spacing="16px">
        <Card>
          {summary}

          <Stack spacing="12px">{content}</Stack>
        </Card>

        {showPrivate &&
          doNotCallCard(
            <DoNotCallPanel
              territory={territory}
              onChange={changeDoNotCalls}
              access={doNotCallAccess}
            />
          )}
      </Stack>
    );
  }

  if (!desktopUp) {
    return (
      <Stack spacing="16px">
        <Card>
          {summary}

          <TabbedSections
            start={initialTab}
            sections={[
              {
                label: isPhone
                  ? t('tr_territoryPhoneNumbers')
                  : t('tr_territoryMap'),
                Component: map,
              },
              { label: t('tr_assignments'), Component: assignments },
              { label: t('tr_details'), Component: form },
            ]}
          />
        </Card>

        {doNotCallCard(doNotCalls)}
      </Stack>
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
            {t('tr_territoryTerritoryDetails')}
          </Typography>
          {form}
        </Card>

        {doNotCallCard(doNotCalls)}
      </Stack>

      <Card>
        {summary}

        <TabbedSections
          sections={[
            { label: mapLabel, Component: map },
            { label: t('tr_assignments'), Component: assignments },
          ]}
        />
      </Card>
    </Box>
  );
};

export default TerritoryDetails;
