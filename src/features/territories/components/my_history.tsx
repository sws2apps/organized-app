import { useState } from 'react';
import { ButtonBase, Collapse, Stack } from '@mui/material';
import { useNavigate } from 'react-router';
import { useAtomValue } from 'jotai';
import {
  Badge,
  Button,
  CustomDivider,
  InfoNote,
  Typography,
} from '@components/index';
import { useBreakpoints } from '@hooks/index';
import { IconExpand } from '@icons/index';
import { Territory } from '@definition/territory';
import { shortDateFormatState } from '@states/settings';
import { territoriesShowHouseholdsState } from '@states/territories';
import {
  CURRENT_PUBLISHER,
  displayDate,
  parseDate,
  emptyListMessage,
} from '../helpers';
import { clickableRow, ROW_DIVIDER, rowStates } from './table_styles';
import { Households } from './territory_table';
import TruncatedText from './truncated_text';

// the latest ones answer "what did I have lately"; the rest load on request
const FIRST_PAGE = 10;
const PAGE = 20;

const OPEN_KEY = 'territories.previousOpen';

// open beside the list on desktop; below it on smaller screens it starts closed
// so the current territories stay in view. The choice is kept on the device.
const readOpen = (fallback: boolean) => {
  try {
    const stored = localStorage.getItem(OPEN_KEY);
    return stored === null ? fallback : stored === '1';
  } catch {
    return fallback;
  }
};

const writeOpen = (open: boolean) => {
  try {
    localStorage.setItem(OPEN_KEY, open ? '1' : '0');
  } catch {
    // private mode: the card simply opens with the default next time
  }
};

const MyHistory = ({ territories }: { territories: Territory[] }) => {
  const navigate = useNavigate();

  const { tablet688Up, desktopUp } = useBreakpoints();

  const [expanded, setExpanded] = useState(() => readOpen(desktopUp));

  const toggle = () => {
    setExpanded(!expanded);
    writeOpen(!expanded);
  };

  const format = useAtomValue(shortDateFormatState);
  const showHouseholds = useAtomValue(territoriesShowHouseholdsState);

  const rows = territories
    .flatMap((territory) =>
      territory.assignments
        .filter(
          (assignment) =>
            assignment.publisher === CURRENT_PUBLISHER && assignment.returnedOn
        )
        .map((assignment) => ({ territory, assignment }))
    )
    .sort(
      (a, b) =>
        (parseDate(b.assignment.returnedOn)?.getTime() ?? 0) -
        (parseDate(a.assignment.returnedOn)?.getTime() ?? 0)
    );
  const [shown, setShown] = useState(FIRST_PAGE);

  const visible = rows.slice(0, shown);
  const remaining = rows.length - visible.length;

  const open = (id: string) =>
    navigate(`/territories/${id}`, { state: { parent: 'My territories' } });

  return (
    <Stack>
      <ButtonBase
        disableRipple
        aria-expanded={expanded}
        onClick={toggle}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          justifyContent: 'flex-start',
          textAlign: 'left',
          borderRadius: 'var(--radius-m)',
          '&:focus-visible': { outline: 'var(--accent-main) auto 1px' },
        }}
      >
        <Typography component="h2" className="h4" color="var(--black)">
          My previous territories
        </Typography>
        {/* on the tinted card the grey badge looks foreign and the accent one
            vanishes, so it takes one accent step up */}
        <Badge
          size="small"
          color="accent"
          filled={false}
          text={String(rows.length)}
          sx={{ width: 'fit-content', background: 'var(--accent-200)' }}
        />

        <IconExpand
          color="var(--accent-main)"
          sx={{
            marginLeft: 'auto',
            transition: 'transform 0.2s ease',
            transform: expanded ? 'rotate(180deg)' : 'none',
          }}
        />
      </ButtonBase>

      <Collapse in={expanded} timeout={200}>
        <Stack spacing="12px" sx={{ paddingTop: '12px' }}>
          {rows.length === 0 && <InfoNote message={emptyListMessage()} />}

          {/* the same row as the territory list above, so both read alike */}
          <Stack
            spacing="2px"
            divider={<CustomDivider color={ROW_DIVIDER.tinted} />}
          >
            {visible.map(({ territory, assignment }) => (
              <Stack
                key={assignment.id}
                direction="row"
                spacing="12px"
                {...clickableRow(() => open(territory.id))}
                sx={{
                  alignItems: 'center',
                  padding: '8px',
                  borderRadius: 'var(--radius-m)',
                  ...rowStates(false, true, 'tinted'),
                }}
              >
                {tablet688Up && (
                  <Stack spacing="4px" sx={{ width: '48px', flexShrink: 0 }}>
                    <Typography
                      className="body-small-semibold"
                      color="var(--accent-400)"
                      sx={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {territory.number}
                    </Typography>
                    {showHouseholds && (
                      <Households
                        count={territory.households}
                        color="var(--accent-350)"
                      />
                    )}
                  </Stack>
                )}

                <Stack spacing="4px" sx={{ flexGrow: 1, minWidth: 0 }}>
                  <TruncatedText
                    color="var(--accent-400)"
                    className="body-small-semibold"
                    text={[
                      !tablet688Up && territory.number,
                      [territory.city, territory.name]
                        .filter(Boolean)
                        .join(' • '),
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  />

                  <Typography
                    className="label-small-regular"
                    color="var(--accent-350)"
                    noWrap
                  >
                    {displayDate(assignment.assignedOn, format)} –{' '}
                    {displayDate(assignment.returnedOn, format)}
                  </Typography>
                </Stack>
              </Stack>
            ))}
          </Stack>

          {remaining > 0 && (
            <Button
              variant="tertiary"
              onClick={() => setShown((count) => count + PAGE)}
              endIcon={<IconExpand />}
              sx={{ width: '100%' }}
            >
              Show more
            </Button>
          )}
        </Stack>
      </Collapse>
    </Stack>
  );
};

export default MyHistory;
