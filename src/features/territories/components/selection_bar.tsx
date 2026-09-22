import { Box, Stack } from '@mui/material';
import { Button, CustomDivider, Typography } from '@components/index';
import { IconMoveBack, IconMoveForward } from '@icons/index';
import { Territory } from '@definition/territory';

type SelectionBarProps = {
  selected: Territory[];
  onAssignMany: VoidFunction;
  onReturnMany: VoidFunction;
};

const SelectionBar = ({
  selected,
  onAssignMany,
  onReturnMany,
}: SelectionBarProps) => {
  if (selected.length === 0) return null;

  const assignable = selected.filter(
    (territory) => territory.status === 'available'
  ).length;

  const returnable = selected.filter(
    (territory) =>
      territory.status === 'in_work' || territory.status === 'overdue'
  ).length;

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        gap: '4px',
        padding: '4px 8px 4px 12px',
        borderRadius: 'var(--radius-l)',
        backgroundColor: 'var(--accent-100)',
        border: '1px solid var(--accent-200)',
      }}
    >
      {/* a caption, not a control: caps, grey, and wide enough that a
          two digit count does not resize the island */}
      <Typography
        className="button-caps"
        color="var(--accent-400)"
        sx={{
          minWidth: '76px',
          marginRight: 'auto',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        Selected: {selected.length}
      </Typography>

      <CustomDivider
        orientation="vertical"
        flexItem
        color="var(--accent-200)"
        sx={{ margin: '2px 4px' }}
      />

      {assignable > 0 && (
        <Box sx={{ width: 'fit-content' }}>
          <Button
            variant="small"
            disableAutoStretch
            startIcon={<IconMoveForward color="var(--accent-main)" />}
            onClick={onAssignMany}
            sx={{
              minHeight: '28px',
              padding: '2px 8px',
              minWidth: '86px',
              justifyContent: 'flex-start',
              '& .MuiButton-startIcon': { marginRight: '6px' },
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            Assign {assignable}
          </Button>
        </Box>
      )}

      {returnable > 0 && (
        <Box sx={{ width: 'fit-content' }}>
          <Button
            variant="small"
            disableAutoStretch
            color="red"
            startIcon={<IconMoveBack color="var(--red-main)" />}
            onClick={onReturnMany}
            sx={{
              minHeight: '28px',
              padding: '2px 8px',
              minWidth: '86px',
              justifyContent: 'flex-start',
              '& .MuiButton-startIcon': { marginRight: '6px' },
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            Return {returnable}
          </Button>
        </Box>
      )}
    </Stack>
  );
};

export default SelectionBar;
