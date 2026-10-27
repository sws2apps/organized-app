import { useAppTranslation } from '@hooks/index';
import { useEffect, useRef, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { Badge, Button, InfoNote } from '@components/index';
import { IconAdd, IconCall, IconEdit } from '@icons/index';
import { Territory } from '@definition/territory';
import RecordList from '@features/territories/components/record_list';
import RowAction from '@features/territories/components/row_action';
import PhoneNumberEditor from '@features/territories/details/phone_number_editor';
import {
  emptyListMessage,
  isDoNotCallNumber,
} from '@features/territories/helpers';
import { offerUndo } from '@features/territories/undo';
import { restorePhoneNumber } from '@features/territories/restore';

// the S-12 phone card holds 32 numbers, so the list stops there
const MAX_PHONE_NUMBERS = 32;

// the widest real row: "+43 (0) 664 12345678" with the do-not-call badge and edit icon
const MIN_COLUMN = 290;
const MAX_COLUMNS = 4;
const GAP = 16;

// a tap on a phone starts the call; the + keeps an international prefix
const call = (number: string) => {
  window.location.href = `tel:${number.replace(/[^\d+]/g, '')}`;
};

const PhoneNumbersPanel = ({
  territory,
  onChange,
  readOnly = false,
}: {
  territory: Territory;
  onChange: (numbers: string[]) => void;
  readOnly?: boolean;
}) => {
  const { t } = useAppTranslation();

  const grid = useRef<HTMLDivElement>(null);

  const [editing, setEditing] = useState<number | 'new'>();
  const [count, setCount] = useState(1);

  useEffect(() => {
    const element = grid.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const fits = Math.floor(
        (entry.contentRect.width + GAP) / (MIN_COLUMN + GAP)
      );
      setCount(Math.min(MAX_COLUMNS, Math.max(1, fits)));
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const numbers = territory.phoneNumbers ?? [];

  const indexed = numbers.map((number, index) => ({ number, index }));
  const perColumn = Math.ceil(indexed.length / count);
  const columns = Array.from({ length: count }, (_, position) =>
    indexed.slice(position * perColumn, (position + 1) * perColumn)
  ).filter((column) => column.length > 0);

  const handleSave = (value: string) =>
    onChange(
      editing === 'new'
        ? [...numbers, value]
        : numbers.map((item, index) => (index === editing ? value : item))
    );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {numbers.length === 0 && <InfoNote message={emptyListMessage()} />}

      {/* as many columns as the width allows, read top to bottom like the card */}
      <Box
        ref={grid}
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
          gap: `0 ${GAP}px`,
          alignItems: 'start',
        }}
      >
        {columns.map((column) => (
          <RecordList
            key={column[0].index}
            items={column.map(({ number, index }) => {
              const blocked = isDoNotCallNumber(territory, number);

              let onClick: VoidFunction | undefined = () => setEditing(index);
              if (readOnly) onClick = blocked ? undefined : () => call(number);

              return {
                id: `${index}-${number}`,
                onClick,
                title: number,
                titleColor: blocked ? 'var(--red-main)' : undefined,
                // a tap on a read-only number dials it, so it says so
                trailing: readOnly && !blocked && (
                  <IconCall color="var(--accent-main)" width={20} height={20} />
                ),
                badge: blocked && (
                  <Badge
                    size="small"
                    color="red"
                    filled={false}
                    text={t('tr_territoryDoNotCallLabel')}
                    sx={{ width: 'fit-content', flexShrink: 0 }}
                  />
                ),
                actions: (
                  <>
                    {!blocked && (
                      <RowAction
                        title={t('tr_territoryTypeCall', { context: 'action' })}
                        onClick={() => call(number)}
                      >
                        <IconCall
                          color="var(--accent-main)"
                          width={18}
                          height={18}
                        />
                      </RowAction>
                    )}
                    {!readOnly && (
                      <RowAction
                        title={t('tr_edit')}
                        onClick={() => setEditing(index)}
                      >
                        <IconEdit
                          color="var(--accent-main)"
                          width={18}
                          height={18}
                        />
                      </RowAction>
                    )}
                  </>
                ),
              };
            })}
          />
        ))}
      </Box>

      {!readOnly && numbers.length < MAX_PHONE_NUMBERS && (
        <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
          <Button
            variant="small"
            disableAutoStretch
            startIcon={<IconAdd color="var(--accent-main)" />}
            onClick={() => setEditing('new')}
            sx={{ minHeight: '32px', minWidth: 'unset' }}
          >
            {t('tr_add')}
          </Button>
        </Stack>
      )}

      {editing !== undefined && (
        <PhoneNumberEditor
          value={editing === 'new' ? undefined : numbers[editing]}
          onClose={() => setEditing(undefined)}
          onSave={handleSave}
          onDelete={() => {
            if (editing === 'new') return;
            const number = numbers[editing];
            onChange(numbers.filter((_, index) => index !== editing));
            offerUndo({
              text: t('tr_territoryNumberDeleted'),
              revert: () => restorePhoneNumber(territory.id, number, editing),
            });
          }}
          onCall={
            editing !== 'new' && !isDoNotCallNumber(territory, numbers[editing])
              ? call
              : undefined
          }
        />
      )}
    </Box>
  );
};

export default PhoneNumbersPanel;
