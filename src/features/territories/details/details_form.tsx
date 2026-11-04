import TerritoryNoteField from '@features/territories/components/note_field';
import { useAppTranslation } from '@hooks/index';
import { useState } from 'react';
import { Box, MenuItem, Stack } from '@mui/material';
import {
  CustomDivider,
  Checkbox,
  Select,
  TextField,
  Typography,
} from '@components/index';
import { useAtomValue } from 'jotai';
import SwitchWithLabel from '@components/switch_with_label';
import { IconEdit } from '@icons/index';
import {
  territoriesState,
  territoryCategoriesState,
} from '@states/territories';
import { Territory, TYPE_LABEL, TerritoryType } from '@definition/territory';
import RowAction from '@features/territories/components/row_action';
import CategoryEditor from '@features/territories/details/category_editor';

const DetailsForm = ({
  territory,
  onChange,
  onCommit,
}: {
  territory: Territory;
  onChange: (territory: Territory) => void;
  onCommit?: VoidFunction;
}) => {
  const { t } = useAppTranslation();

  const [categoryEditor, setCategoryEditor] = useState(false);

  const categories = useAtomValue(territoryCategoriesState);
  const territories = useAtomValue(territoriesState);

  // keep the saved number until the typed one is usable, so the list never shows it blank or twice
  const [number, setNumber] = useState(territory.number);

  const isStored = territories.some((item) => item.id === territory.id);

  const isTaken = (value: string) =>
    territories.some(
      (item) => item.id !== territory.id && item.number.trim() === value
    );

  const trimmed = number.trim();
  const isDuplicate = !!trimmed && isTaken(trimmed);
  const isBlank = isStored && !trimmed;

  let numberHelp = isBlank ? t('tr_territoryEnterANumber') : '';
  if (isDuplicate) numberHelp = t('tr_territoryThisNumberIsAlreadyUsed');

  const handleNumberChange = (value: string) => {
    setNumber(value);

    const next = value.trim();

    if (!isStored || (next && !isTaken(next))) {
      onChange({ ...territory, number: value });
    }
  };

  const toggleCategory = (category: string) =>
    onChange({
      ...territory,
      categories: territory.categories.includes(category)
        ? territory.categories.filter((item) => item !== category)
        : [...territory.categories, category],
    });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <CategoryEditor
        open={categoryEditor}
        onClose={() => setCategoryEditor(false)}
      />

      {/* a container query, not a screen one: this card is 380px wide */}
      <Box sx={{ containerType: 'inline-size', width: '100%' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            gap: '16px',
            '& > *': { gridColumn: 'span 12' },
            '& > *:nth-of-type(1)': { gridColumn: 'span 4' },
            '& > *:nth-of-type(2)': { gridColumn: 'span 8' },
            '& > *:nth-of-type(4)': { gridColumn: 'span 5' },
            '& > *:nth-of-type(5)': { gridColumn: 'span 7' },
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
            label={t('tr_number')}
            value={number}
            error={isDuplicate || isBlank}
            helperText={numberHelp}
            onChange={(event) => handleNumberChange(event.target.value)}
            onBlur={onCommit}
            onKeyDown={(event) => {
              if (event.key === 'Enter') onCommit?.();
            }}
          />

          <TextField
            label={t('tr_name')}
            value={territory.name}
            onChange={(event) =>
              onChange({ ...territory, name: event.target.value })
            }
          />

          <TextField
            label={t('tr_territoryLocality')}
            value={territory.city}
            onChange={(event) =>
              onChange({ ...territory, city: event.target.value })
            }
          />

          <TextField
            label={t('tr_territoryHouseholds')}
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
            label={t('tr_type')}
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
                  {t(TYPE_LABEL[type])}
                </Typography>
              </MenuItem>
            ))}
          </Select>

          <TerritoryNoteField
            kind="territory"
            value={territory.notes ?? ''}
            onChange={(notes) =>
              onChange({ ...territory, notes: notes || undefined })
            }
          />

          <TextField
            label={t('tr_territoryWarningFrontSide')}
            helperText={t('tr_territoryPrintedInRedOnTheMapKeepItShort')}
            value={territory.warning ?? ''}
            onChange={(event) =>
              onChange({
                ...territory,
                warning: event.target.value || undefined,
              })
            }
          />
        </Box>
      </Box>

      <CustomDivider color="var(--accent-200)" />

      {/* the hit areas already add air, so this takes back part of the gap */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          margin: '-10px 0',
        }}
      >
        <Stack direction="row" spacing="4px" sx={{ alignItems: 'center' }}>
          <Typography className="h3" color="var(--black)">
            {t('tr_categories')}
          </Typography>

          <RowAction
            title={t('tr_edit')}
            onClick={() => setCategoryEditor(true)}
          >
            <IconEdit color="var(--accent-main)" width={18} height={18} />
          </RowAction>
        </Stack>

        <Stack
          direction="row"
          sx={{ flexWrap: 'wrap', columnGap: '24px', rowGap: '8px' }}
        >
          {categories.map((category) => (
            <Checkbox
              key={category.id}
              label={category.name}
              checked={territory.categories.includes(category.id)}
              onChange={() => toggleCategory(category.id)}
            />
          ))}
        </Stack>
      </Box>

      <CustomDivider color="var(--accent-200)" />

      <SwitchWithLabel
        label={t('tr_territoryCardLost')}
        helper={t('tr_territoryTheCardNeedsReprinting')}
        checked={territory.cardLost}
        onChange={(value) => onChange({ ...territory, cardLost: value })}
      />
    </Box>
  );
};

export default DetailsForm;
