import TerritoryNote from '@features/territories/components/note';
import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import { useAtomValue } from 'jotai';
import { Button, CustomDivider, InfoNote, Typography } from '@components/index';
import { IconCheck, IconPerson } from '@icons/index';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { monthNamesState } from '@states/app';
import { shortDateFormatState } from '@states/settings';
import {
  assignmentIssues,
  displayDate,
  issuesText,
  parseDate,
  emptyListMessage,
} from '@features/territories/helpers';
import { holderText } from '@features/territories/group_holder';
import {
  clickableRow,
  rowStates,
} from '@features/territories/components/table_styles';
import { CampaignBadge } from '@features/territories/components/territory_badges';
import TruncatedText from '@features/territories/components/truncated_text';
import { Territory } from '@definition/territory';

type Row = {
  territory: Territory;
  assignment: Territory['assignments'][number];
};

const PAGE = 40;

const AssignmentHistory = ({
  territories,
  selectedId,
  onSelect,
}: {
  territories: Territory[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}) => {
  const { t } = useAppTranslation();

  const { tablet688Up } = useBreakpoints();

  const shortDateFormat = useAtomValue(shortDateFormatState);
  const monthNames = useAtomValue(monthNamesState);

  const [limit, setLimit] = useState(PAGE);

  const all: Row[] = territories
    .flatMap((territory) =>
      territory.assignments.map((assignment) => ({ territory, assignment }))
    )
    .sort(
      (a, b) =>
        (parseDate(b.assignment.assignedOn)?.getTime() ?? 0) -
        (parseDate(a.assignment.assignedOn)?.getTime() ?? 0)
    );

  if (all.length === 0) {
    return <InfoNote message={emptyListMessage()} />;
  }

  const groups = all
    .slice(0, limit)
    .reduce<{ label: string; rows: Row[] }[]>((result, row) => {
      const date = parseDate(row.assignment.assignedOn);
      const label = date
        ? `${monthNames[date.getMonth()]} ${date.getFullYear()}`
        : '–';

      const last = result.at(-1);

      if (last?.label === label) last.rows.push(row);
      else result.push({ label, rows: [row] });

      return result;
    }, []);

  const date = (value?: string) => displayDate(value, shortDateFormat);

  return (
    <Stack spacing="24px">
      {groups.map((group) => (
        <Stack key={group.label} spacing="4px">
          <Typography
            className="body-small-semibold"
            color="var(--grey-400)"
            sx={{ padding: '0 8px 4px' }}
          >
            {group.label}
          </Typography>

          <Stack
            spacing="4px"
            divider={<CustomDivider color="var(--accent-200)" />}
          >
            {group.rows.map(({ territory, assignment }) => {
              const open = !assignment.returnedOn;
              const warning = issuesText(assignmentIssues(assignment));

              return (
                <Stack
                  key={assignment.id}
                  direction="row"
                  spacing="12px"
                  {...(onSelect
                    ? clickableRow(() => onSelect(territory.id))
                    : {})}
                  sx={{
                    alignItems: 'center',
                    padding: '10px 8px',
                    borderRadius: 'var(--radius-m)',
                    ...rowStates(territory.id === selectedId, !!onSelect),
                  }}
                >
                  {tablet688Up && (
                    <Typography
                      className="body-small-semibold"
                      color="var(--black)"
                      sx={{ width: '48px', flexShrink: 0 }}
                    >
                      {territory.number}
                    </Typography>
                  )}

                  <Stack spacing="4px" sx={{ flexGrow: 1, minWidth: 0 }}>
                    <TruncatedText
                      className="body-small-semibold"
                      text={[
                        !tablet688Up && territory.number,
                        [territory.city, territory.name]
                          .filter(Boolean)
                          .join(' • '),
                      ]
                        .filter(Boolean)
                        .join('  ')}
                    />

                    <Stack
                      direction="row"
                      spacing="4px"
                      sx={{ alignItems: 'center', minWidth: 0 }}
                    >
                      <IconPerson
                        color="var(--grey-400)"
                        width={16}
                        height={16}
                      />
                      <TruncatedText
                        className="label-small-regular"
                        color="var(--grey-400)"
                        text={holderText(assignment)}
                      />
                      <CampaignBadge assignment={assignment} />
                    </Stack>

                    <TerritoryNote kind="assignment" value={assignment.note} />

                    {warning && (
                      <Typography
                        className="label-small-regular"
                        color="var(--red-main)"
                      >
                        {warning}
                      </Typography>
                    )}
                  </Stack>

                  <Stack
                    spacing="4px"
                    sx={{ alignItems: 'flex-end', flexShrink: 0 }}
                  >
                    <Typography
                      className="label-small-regular"
                      color="var(--grey-400)"
                      noWrap
                    >
                      {date(assignment.assignedOn)}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing="4px"
                      sx={{ alignItems: 'center' }}
                    >
                      {!open && (
                        <IconCheck
                          color="var(--green-main)"
                          width={14}
                          height={14}
                        />
                      )}
                      <Typography
                        className="label-small-regular"
                        color={open ? 'var(--orange-main)' : 'var(--grey-350)'}
                        noWrap
                      >
                        {open
                          ? t('tr_inProgress')
                          : date(assignment.returnedOn)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      ))}

      {all.length > limit && (
        <Box>
          <Button
            variant="small"
            disableAutoStretch
            onClick={() => setLimit(limit + PAGE)}
          >
            {t('tr_territoryShowMore')}
          </Button>
        </Box>
      )}
    </Stack>
  );
};

export default AssignmentHistory;
