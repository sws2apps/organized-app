import { useState } from 'react';
import { Box, ButtonBase, Popover, Stack } from '@mui/material';
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
  CATEGORY_COLOR_LABEL,
  CATEGORY_COLORS,
  CategoryColor,
  MAX_CATEGORIES,
  TerritoryCategoryOption,
} from '@definition/territory';
import { categorySwatch, toCategoryColor } from '../category_colors';
import IconButton from '@components/icon_button';

// one dot per row that opens the palette, instead of a wall of circles
const ColorDot = ({
  color,
  onChange,
}: {
  color: CategoryColor;
  onChange: (next: CategoryColor) => void;
}) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const swatch = (option: CategoryColor, size: number) => ({
    width: `${size}px`,
    height: `${size}px`,
    flexShrink: 0,
    borderRadius: 'var(--radius-max)',
    backgroundColor: categorySwatch(option),
  });

  return (
    <>
      <ButtonBase
        aria-label={`Color: ${CATEGORY_COLOR_LABEL[color]}`}
        aria-haspopup="true"
        onClick={(event) => setAnchor(event.currentTarget)}
        sx={{
          width: '40px',
          height: '40px',
          flexShrink: 0,
          borderRadius: 'var(--radius-l)',
          '&:hover': { backgroundColor: 'var(--accent-100)' },
          '&:focus-visible': { outline: 'var(--accent-main) auto 1px' },
        }}
      >
        <Box sx={swatch(color, 20)} />
      </ButtonBase>

      <Popover
        open={!!anchor}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: {
            className: 'small-card-shadow',
            sx: {
              padding: '8px',
              borderRadius: 'var(--radius-l)',
              border: '1px solid var(--accent-200)',
              backgroundColor: 'var(--white)',
            },
          },
        }}
      >
        <Stack direction="row" sx={{ gap: '4px' }}>
          {CATEGORY_COLORS.map((option) => (
            <Tooltip key={option} title={CATEGORY_COLOR_LABEL[option]}>
              <ButtonBase
                aria-label={CATEGORY_COLOR_LABEL[option]}
                aria-pressed={option === color}
                onClick={() => {
                  onChange(option);
                  setAnchor(null);
                }}
                sx={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-max)',
                  '&:hover': { backgroundColor: 'var(--accent-100)' },
                  '&:focus-visible': { outline: 'var(--accent-main) auto 1px' },
                }}
              >
                <Box
                  sx={{
                    ...swatch(option, 24),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {option === color && (
                    <IconCheck
                      color="var(--always-white)"
                      width={16}
                      height={16}
                    />
                  )}
                </Box>
              </ButtonBase>
            </Tooltip>
          ))}
        </Stack>
      </Popover>
    </>
  );
};

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
        // the first colour nobody uses yet, so new categories stand apart
        color:
          CATEGORY_COLORS.find(
            (option) =>
              !draft.some((item) => toCategoryColor(item.color) === option)
          ) ?? 'grey',
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
      <Stack spacing="8px" sx={{ width: '100%' }}>
        {draft.map((category) => (
          <Stack
            key={category.id}
            direction="row"
            sx={{ alignItems: 'center', gap: '8px', width: '100%' }}
          >
            <ColorDot
              color={toCategoryColor(category.color)}
              onChange={(color) => patch(category.id, { color })}
            />

            <TextField
              placeholder="Category name"
              value={category.name}
              autoFocus={category.name.length === 0}
              onChange={(event) =>
                patch(category.id, { name: event.target.value })
              }
            />

            {/* the square delete from the circuit overseer visits, as tall as the field */}
            <Tooltip title="Delete">
              <IconButton
                color="error"
                edge={false}
                aria-label="Delete"
                onClick={() =>
                  setDraft(draft.filter((item) => item.id !== category.id))
                }
                sx={{
                  flexShrink: 0,
                  borderRadius: 'var(--radius-m)',
                  width: '48px',
                  height: '48px',
                }}
              >
                <IconDelete color="var(--red-main)" />
              </IconButton>
            </Tooltip>
          </Stack>
        ))}
      </Stack>

      {/* at the limit the button simply goes away */}
      {draft.length < MAX_CATEGORIES && (
        <Stack
          direction="row"
          sx={{ justifyContent: 'flex-end', width: '100%' }}
        >
          <Button
            variant="small"
            disableAutoStretch
            startIcon={<IconAdd color="var(--accent-main)" />}
            onClick={handleAdd}
            sx={{ minHeight: '32px', minWidth: 'unset' }}
          >
            Add
          </Button>
        </Stack>
      )}

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
