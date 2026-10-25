import { Box, Stack } from '@mui/material';
import { Button, Typography } from '@components/index';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { Territory } from '@definition/territory';
import { selectionActions } from '@features/territories/components/selection_actions';
import { DONE_COLOR } from '@features/territories/components/done_color';

const done = { ...DONE_COLOR, color: 'var(--done)' };

type SelectionBarProps = {
  selected: Territory[];
  onAssignMany: VoidFunction;
  onReturnMany: VoidFunction;
  onClear: VoidFunction;
};

const SelectionBar = ({
  selected,
  onAssignMany,
  onReturnMany,
  onClear,
}: SelectionBarProps) => {
  const { t } = useAppTranslation();

  const { tablet600Up } = useBreakpoints();
  if (!selected.length) return null;
  // 2px inset keeps the bar exactly as tall as the title row it joins
  const button = {
    minHeight: tablet600Up ? '32px' : '36px',
    padding: '0 10px',
    minWidth: 0,
    whiteSpace: 'nowrap',
    fontVariantNumeric: 'tabular-nums',
  };
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '2px',
        padding: '2px',
        width: tablet600Up ? 'fit-content' : '100%',
        borderRadius: 'var(--radius-l)',
        backgroundColor: 'var(--accent-100)',
      }}
    >
      {tablet600Up && (
        <Typography
          className="body-small-regular"
          color="var(--accent-400)"
          sx={{ padding: '0 10px', whiteSpace: 'nowrap' }}
        >
          {t('tr_territorySelected', { n: selected.length })}
        </Typography>
      )}
      {selectionActions(selected).map(({ kind, count }) => (
        <Button
          key={kind}
          variant="small"
          disableAutoStretch
          color={kind === 'return' ? 'green' : undefined}
          onClick={kind === 'assign' ? onAssignMany : onReturnMany}
          sx={kind === 'return' ? { ...button, ...done } : button}
        >
          {t(
            kind === 'assign'
              ? 'tr_territoryAssignSelected'
              : 'tr_territoryReturnSelected',
            {
              n: count,
            }
          )}
        </Button>
      ))}
      <Box
        sx={{
          width: '1px',
          alignSelf: 'stretch',
          margin: '6px 2px',
          backgroundColor: 'var(--accent-200)',
        }}
      />
      <Button variant="small" disableAutoStretch onClick={onClear} sx={button}>
        {t('tr_territoryDeselectAll')}
      </Button>
    </Stack>
  );
};
export default SelectionBar;
