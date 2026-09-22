import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import { useAtom, useSetAtom } from 'jotai';
import { Button, TextField } from '@components/index';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import Tooltip from '@components/tooltip';
import { IconAdd, IconCheck, IconDelete } from '@icons/index';
import { displaySnackNotification } from '@services/states/app';
import {
  territoriesState,
  territoryCategoriesState,
} from '@states/territories';
import {
  CATEGORY_COLORS,
  MAX_CATEGORIES,
  TerritoryCategoryOption,
} from '@definition/territory';
import { BadgeColor } from '@definition/app';
import RowAction from '../components/row_action';

// grey has no -main token, so the swatch borrows the darkest readable shade
const swatchColor = (color: BadgeColor) =>
  color === 'grey' ? 'var(--grey-350)' : `var(--${color}-main)`;

const ColorPicker = ({
  color,
  onChange,
}: {
  color: BadgeColor;
  onChange: (next: BadgeColor) => void;
}) => (
  <Stack direction="row" sx={{ flexShrink: 0, gap: '8px' }}>
    {CATEGORY_COLORS.map((option) => (
      <Tooltip key={option} title={option}>
        <Box
          role="button"
          aria-label={option}
          onClick={() => onChange(option)}
          sx={{
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            borderRadius: 'var(--radius-max)',
            backgroundColor: swatchColor(option),
            outline: option === color ? '2px solid var(--accent-dark)' : 'none',
            outlineOffset: '2px',
            transition: 'transform 0.15s ease',
            '&:hover': { transform: 'scale(1.08)' },
          }}
        >
          {option === color && (
            <IconCheck color="var(--always-white)" width={18} height={18} />
          )}
        </Box>
      </Tooltip>
    ))}
  </Stack>
);

const CategoryEditor = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: VoidFunction;
}) => {
  const [categories, setCategories] = useAtom(territoryCategoriesState);
  const setTerritories = useSetAtom(territoriesState);

  const [draft, setDraft] = useState<TerritoryCategoryOption[]>(categories);

  if (!open) return null;

  const patch = (id: string, changes: Partial<TerritoryCategoryOption>) =>
    setDraft((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...changes } : item))
    );

  const handleAdd = () => {
    if (draft.length >= MAX_CATEGORIES) {
      displaySnackNotification({
        header: 'Too many categories',
        message: `A congregation can keep up to ${MAX_CATEGORIES} categories.`,
        severity: 'error',
      });

      return;
    }

    setDraft([
      ...draft,
      {
        id: `category-${Date.now()}`,
        name: '',
        color: CATEGORY_COLORS[draft.length % CATEGORY_COLORS.length],
      },
    ]);
  };

  const handleSave = () => {
    const kept = draft.filter((category) => category.name.trim().length > 0);

    const removed = categories
      .filter((category) => !kept.some((item) => item.id === category.id))
      .map((category) => category.id);

    setCategories(kept);

    if (removed.length) {
      setTerritories((prev) =>
        prev.map((territory) => ({
          ...territory,
          categories: territory.categories.filter(
            (id) => !removed.includes(id)
          ),
        }))
      );
    }

    onClose();
  };

  return (
    <Dialog
      onClose={onClose}
      open
      title="Categories"
      description={`Up to ${MAX_CATEGORIES} categories, each with its own color.`}
    >
      <Stack
        spacing={{ mobile: '16px', tablet600: '8px' }}
        sx={{ width: '100%' }}
      >
        {draft.map((category) => (
          <Box
            key={category.id}
            sx={{
              display: 'grid',
              alignItems: 'center',
              columnGap: '12px',
              rowGap: '8px',
              width: '100%',
              gridTemplateColumns: {
                mobile: 'minmax(0, 1fr) auto',
                tablet600: 'minmax(0, 1fr) auto auto',
              },
              gridTemplateAreas: {
                mobile: '"name delete" "colors colors"',
                tablet600: '"name colors delete"',
              },
            }}
          >
            <TextField
              sx={{ gridArea: 'name' }}
              placeholder="Category name"
              value={category.name}
              autoFocus={category.name.length === 0}
              onChange={(event) =>
                patch(category.id, { name: event.target.value })
              }
            />

            <Box sx={{ gridArea: 'colors' }}>
              <ColorPicker
                color={category.color}
                onChange={(color) => patch(category.id, { color })}
              />
            </Box>

            <Box sx={{ gridArea: 'delete' }}>
              <RowAction
                title="Delete"
                color="error"
                onClick={() =>
                  setDraft(draft.filter((item) => item.id !== category.id))
                }
              >
                <IconDelete color="var(--red-main)" width={18} height={18} />
              </RowAction>
            </Box>
          </Box>
        ))}
      </Stack>

      <Button
        variant="small"
        disableAutoStretch
        startIcon={<IconAdd color="var(--accent-main)" />}
        onClick={handleAdd}
        sx={{ minHeight: '32px', minWidth: 'unset' }}
      >
        Add
      </Button>

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="main" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryEditor;
