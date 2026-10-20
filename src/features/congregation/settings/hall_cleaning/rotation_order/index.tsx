import { useMemo } from 'react';
import { Box } from '@mui/material';
import { ReactSortable } from 'react-sortablejs';
import { IconDragHandle } from '@components/icons';
import { RotationOrderProps } from '@features/congregation/settings/hall_cleaning/rotation_order/index.types';
import { useAppTranslation } from '@hooks/index';
import IconButton from '@components/icon_button';
import Checkbox from '@components/checkbox';

type RotationItem = { id: string; name: string; included: boolean };

// groups in the rotation come first in their turn order; a group added later
// waits unchecked at the bottom, so joining is a choice and not a reshuffle
const RotationOrder = ({ groups, rotation, onChange }: RotationOrderProps) => {
  const { t } = useAppTranslation();

  const items = useMemo<RotationItem[]>(() => {
    const included = rotation
      .map((id) => groups.find((group) => group.value === id))
      .filter((group) => group !== undefined)
      .map((group) => ({ id: group.value, name: group.label, included: true }));

    const excluded = groups
      .filter((group) => !rotation.includes(group.value))
      .map((group) => ({
        id: group.value,
        name: group.label,
        included: false,
      }));

    return [...included, ...excluded];
  }, [groups, rotation]);

  const save = (list: RotationItem[]) => {
    const next = list.filter((item) => item.included).map((item) => item.id);

    if (next.join() !== rotation.join()) onChange(next);
  };

  const handleToggle = (id: string, checked: boolean) => {
    const list = items.map((item) =>
      item.id === id ? { ...item, included: checked } : item
    );

    // keep at least one group, otherwise the rotation would switch off
    if (!list.some((item) => item.included)) return;

    save(list);
  };

  const move = (id: string, direction: -1 | 1) => {
    const index = rotation.indexOf(id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= rotation.length) return;

    const next = [...rotation];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <ReactSortable list={items} setList={save} handle=".scrollable-icon">
      {items.map((item) => (
        <Box
          key={item.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <IconButton
            className={item.included ? 'scrollable-icon' : undefined}
            aria-label={t('tr_hallCleaningReorderGroup', { group: item.name })}
            aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown"
            title={t('tr_hallCleaningReorderHelp')}
            disabled={!item.included}
            onKeyDown={(event) => {
              if (
                !event.altKey ||
                (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')
              )
                return;
              event.preventDefault();
              move(item.id, event.key === 'ArrowUp' ? -1 : 1);
            }}
            sx={{
              margin: 0,
              cursor: item.included ? 'grab' : undefined,
              borderRadius: 'var(--radius-l)',
            }}
          >
            <IconDragHandle
              color={item.included ? 'var(--grey-400)' : 'var(--grey-300)'}
            />
          </IconButton>
          <Checkbox
            label={item.name}
            checked={item.included}
            onChange={(_, checked) => handleToggle(item.id, checked)}
            sx={{ flex: 1, minWidth: 0, marginRight: 0 }}
          />
        </Box>
      ))}
    </ReactSortable>
  );
};

export default RotationOrder;
