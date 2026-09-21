import { useState } from 'react';
import { Box, MenuItem, Stack } from '@mui/material';
import {
  Badge,
  CustomDivider,
  FilterChip,
  ScrollableTabs,
  Select,
  Switch,
  TextField,
  Typography,
} from '@components/index';
import { useAtomValue } from 'jotai';
import IconButton from '@components/icon_button';
import Tooltip from '@components/tooltip';
import { IconEdit } from '@icons/index';
import { territoryCategoriesState } from '@states/territories';
import { daysLabel } from '../helpers';
import {
  Territory,
  TerritoryCategory,
  TYPE_LABEL,
  TerritoryType,
} from '@definition/territory';
import Card from '@components/card';
import DoNotCallPanel from './do_not_call_panel';
import TerritoryAssignments from './territory_assignments';
import TerritoryMap from './territory_map';
import CategoryEditor from './category_editor';
import TerritoryStats from './territory_stats';
import { StatusBadge } from '../components/territory_badges';

type TerritoryDetailsProps = {
  territory: Territory;
  numberError?: boolean;
  onChange: (territory: Territory) => void;
};

const TerritoryDetails = ({
  territory,
  numberError = false,
  onChange,
}: TerritoryDetailsProps) => {
  const [tab, setTab] = useState(0);
  const [categoryEditor, setCategoryEditor] = useState(false);

  const categories = useAtomValue(territoryCategoriesState);

  const toggleCategory = (category: TerritoryCategory) =>
    onChange({
      ...territory,
      categories: territory.categories.includes(category)
        ? territory.categories.filter((item) => item !== category)
        : [...territory.categories, category],
    });

  const tabs = [
    {
      label: 'Territory map',
      Component: <TerritoryMap territory={territory} />,
    },
    {
      label: 'Assignments',
      Component: (
        <TerritoryAssignments
          territory={territory}
          onChange={(assignments) => onChange({ ...territory, assignments })}
        />
      ),
    },
    {
      label: 'Do not call',
      badge: territory.doNotCalls.length,
      Component: (
        <DoNotCallPanel
          territory={territory}
          onChange={(doNotCalls) => onChange({ ...territory, doNotCalls })}
        />
      ),
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          mobile: 'minmax(0, 1fr)',
          desktop: '380px minmax(0, 1fr)',
        },
        gap: '16px',
        alignItems: 'start',
      }}
    >
      <CategoryEditor
        open={categoryEditor}
        onClose={() => setCategoryEditor(false)}
      />

      <Card
        sx={{ order: { mobile: 2, desktop: 1 } }}
        data-testid="territory-form"
      >
        <Typography className="h4" color="var(--black)">
          Territory details
        </Typography>

        {/* a container query, not a screen one: this card is 380px wide
            beside the map and full width below it, and the spans are chosen
            so every row fills completely */}
        <Box sx={{ containerType: 'inline-size', width: '100%' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
              gap: '16px',
              '& > *': { gridColumn: 'span 12' },
              '@container (min-width: 460px)': {
                '& > *:nth-of-type(1)': { gridColumn: 'span 3' },
                '& > *:nth-of-type(2)': { gridColumn: 'span 9' },
                '& > *:nth-of-type(3)': { gridColumn: 'span 4' },
                '& > *:nth-of-type(4)': { gridColumn: 'span 4' },
                '& > *:nth-of-type(5)': { gridColumn: 'span 4' },
              },
            }}
          >
            <TextField
              label="Number"
              value={territory.number}
              error={numberError}
              helperText={numberError ? 'This number is already used' : ''}
              onChange={(event) =>
                onChange({ ...territory, number: event.target.value })
              }
            />

            <TextField
              label="Name"
              value={territory.name}
              onChange={(event) =>
                onChange({ ...territory, name: event.target.value })
              }
            />

            <TextField
              label="Locality"
              value={territory.city}
              onChange={(event) =>
                onChange({ ...territory, city: event.target.value })
              }
            />

            <TextField
              label="Households"
              type="number"
              value={String(territory.households)}
              onChange={(event) =>
                onChange({
                  ...territory,
                  households: Number(event.target.value) || 0,
                })
              }
            />

            <Select
              label="Type"
              value={territory.type}
              onChange={(event) =>
                onChange({
                  ...territory,
                  type: event.target.value as TerritoryType,
                })
              }
            >
              {(Object.keys(TYPE_LABEL) as TerritoryType[]).map((type) => (
                <MenuItem key={type} value={type}>
                  <Typography className="body-regular">
                    {TYPE_LABEL[type]}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Stack
            direction="row"
            spacing="8px"
            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Typography className="body-small-regular" color="var(--grey-400)">
              Categories
            </Typography>

            <Tooltip title="Edit categories">
              <IconButton onClick={() => setCategoryEditor(true)}>
                <IconEdit color="var(--accent-main)" />
              </IconButton>
            </Tooltip>
          </Stack>

          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: '8px' }}>
            {categories.map((category) => (
              <FilterChip
                key={category.id}
                label={category.name}
                selected={territory.categories.includes(category.id)}
                onClick={() => toggleCategory(category.id)}
              />
            ))}
          </Stack>
        </Box>

        <Stack
          direction="row"
          spacing="12px"
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Stack spacing="2px">
            <Typography className="body-small-regular" color="var(--black)">
              Card lost
            </Typography>
            <Typography className="label-small-regular" color="var(--grey-400)">
              The printed card is missing and has to be printed again
            </Typography>
          </Stack>

          <Switch
            checked={territory.cardLost}
            onChange={(_, value) => onChange({ ...territory, cardLost: value })}
          />
        </Stack>
      </Card>

      <Card sx={{ order: { mobile: 1, desktop: 2 } }}>
        <Stack
          direction="row"
          sx={{ alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}
        >
          <Box sx={{ width: 'fit-content' }}>
            <StatusBadge status={territory.status} />
          </Box>

          <Box sx={{ width: 'fit-content' }}>
            <Badge
              size="small"
              filled={false}
              color="grey"
              text={TYPE_LABEL[territory.type]}
            />
          </Box>

          {territory.holder && (
            <Typography className="body-small-regular" color="var(--grey-400)">
              {territory.holder} · out {daysLabel(territory.daysOut)}
            </Typography>
          )}
        </Stack>

        <TerritoryStats territory={territory} />

        <Box>
          <ScrollableTabs
            appearance="plain"
            tabs={tabs.map(({ label, badge }) => ({ label, badge }))}
            value={tab}
            onChange={setTab}
          />

          <CustomDivider color="var(--accent-200)" />

          <Box sx={{ paddingTop: '20px' }}>{tabs[tab].Component}</Box>
        </Box>
      </Card>
    </Box>
  );
};

export default TerritoryDetails;
