import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { Box, Stack } from '@mui/material';
import { Typography } from '@components/index';
import { IconAdd } from '@icons/index';
import TabSwitcher from '@components/tab_switcher';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { AssignmentHolder } from '@definition/territory';
import {
  addAssignee,
  territoryAssigneesState,
} from '@features/territories/assignees';
import { HolderChoice, HolderMode } from '@features/territories/card_choice';
import PublisherSearch from '@features/territories/components/publisher_search';

const Hint = ({ text }: { text: string }) => (
  <Typography
    role="alert"
    className="label-small-regular"
    color="var(--red-main)"
    sx={{ paddingInline: '16px' }}
  >
    {text}
  </Typography>
);

// what a search shows when the typed name isn't on the list: add it there and
// then, so the assignment can go ahead
const AddName = ({
  name,
  group,
  onAdded,
}: {
  name: string;
  group: boolean;
  onAdded: (name: string) => void;
}) => {
  const { t } = useAppTranslation();

  const [busy, setBusy] = useState(false);
  const trimmed = name.trim();
  if (!addAssignee || !trimmed) return t('tr_noResults');

  return (
    <Box
      component="button"
      type="button"
      className="body-small-semibold"
      disabled={busy}
      // keeps the list open until the click lands
      onMouseDown={(event) => event.preventDefault()}
      onClick={async () => {
        setBusy(true);
        try {
          await addAssignee!(trimmed, group);
          onAdded(trimmed);
        } finally {
          setBusy(false);
        }
      }}
      sx={{
        all: 'unset',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        color: 'var(--accent-main)',
        '& svg path': { fill: 'currentColor' },
        '&:hover': { color: 'var(--accent-dark)' },
        '&:disabled': { opacity: 0.5, cursor: 'default' },
      }}
    >
      <IconAdd width={20} height={20} />
      {group
        ? t('tr_territoryAddTheGroup', { name: trimmed })
        : t('tr_territoryAddAsAPublisher', { name: trimmed })}
    </Box>
  );
};

export const HolderModeSwitch = ({
  value,
  onChange,
}: {
  value: HolderChoice;
  onChange: (next: HolderChoice) => void;
}) => {
  const { t } = useAppTranslation();
  return (
    <TabSwitcher
      ariaLabel={t('tr_territoryAssignTo')}
      surface="light"
      value={value.mode}
      onChange={(mode: HolderMode) => onChange({ ...value, mode })}
      options={[
        { value: 'publisher', label: t('tr_publisher') },
        { value: 'group', label: t('tr_fieldServiceGroup') },
      ]}
      sx={{ width: '100%', '& button': { minHeight: '36px' } }}
    />
  );
};

// people only, and in group mode the group first; a hint shows on an empty
// field once a save was tried
export const HolderPickers = ({
  value,
  onChange,
  showMissing,
  autoFocus,
  current,
}: {
  value: HolderChoice;
  onChange: (next: HolderChoice) => void;
  showMissing: boolean;
  autoFocus?: boolean;
  // names no longer on the list, e.g. someone who moved, stay choosable
  current?: Partial<AssignmentHolder>;
}) => {
  const { t } = useAppTranslation();

  const { tablet600Up } = useBreakpoints();

  const assignees = useAtomValue(territoryAssigneesState);
  const optionsOf = (group: boolean, kept?: string, id?: string) => {
    const options = assignees.filter((item) => item.group === group);
    if (
      kept &&
      !options.some((item) => (id ? item.id === id : item.name === kept))
    )
      options.push({ id: id ?? `legacy:${kept}`, name: kept, group });
    return options;
  };
  const people = optionsOf(false, current?.publisher, current?.publisherId);
  const groups = optionsOf(true, current?.group, current?.groupId);
  const selected = (
    options: typeof assignees,
    name: string | null,
    id?: string
  ) => {
    if (id) return options.find((item) => item.id === id) ?? null;
    const matches = options.filter((item) => item.name === name);
    return matches.length === 1 ? matches[0] : null;
  };

  const isGroup = value.mode === 'group';
  const [groupQuery, setGroupQuery] = useState('');
  const [personQuery, setPersonQuery] = useState('');

  return (
    <Stack
      direction={tablet600Up ? 'row' : 'column'}
      spacing="16px"
      sx={{ width: '100%' }}
    >
      {isGroup && (
        <Stack spacing="4px" sx={{ flex: 1, minWidth: 0 }}>
          <PublisherSearch
            label={t('tr_fieldServiceGroup')}
            placeholder={t('tr_territorySearchGroups')}
            options={groups}
            value={selected(groups, value.group, value.groupId)}
            onChange={(group) =>
              onChange({
                ...value,
                group: group?.name ?? null,
                groupId: group?.id,
              })
            }
            getName={(item) => item.name}
            getId={(item) => item.id}
            onInputChange={setGroupQuery}
            noOptionsText={
              <AddName
                name={groupQuery}
                group
                onAdded={(group) => onChange({ ...value, group })}
              />
            }
            autoFocus={autoFocus && !value.group}
          />
          {showMissing && !value.group && (
            <Hint text={t('tr_territoryChooseAGroup')} />
          )}
        </Stack>
      )}

      <Stack spacing="4px" sx={{ flex: 1, minWidth: 0 }}>
        <PublisherSearch
          label={isGroup ? t('tr_territoryAssignedTo') : t('tr_publisher')}
          options={people}
          value={selected(people, value.publisher, value.publisherId)}
          onChange={(publisher) =>
            onChange({
              ...value,
              publisher: publisher?.name ?? null,
              publisherId: publisher?.id,
            })
          }
          getName={(item) => item.name}
          getId={(item) => item.id}
          onInputChange={setPersonQuery}
          noOptionsText={
            <AddName
              name={personQuery}
              group={false}
              onAdded={(publisher) => onChange({ ...value, publisher })}
            />
          }
          autoFocus={
            autoFocus && !value.publisher && (!isGroup || !!value.group)
          }
        />
        {showMissing && !value.publisher && (
          <Hint
            text={
              isGroup
                ? t('tr_territoryChooseWhoItIsAssignedTo')
                : t('tr_territoryChooseAPublisher')
            }
          />
        )}
      </Stack>
    </Stack>
  );
};

// one person, e.g. who gave a territory back; a name no longer on the list
// stays choosable
export const PublisherPicker = ({
  label,
  value,
  onChange,
  current,
}: {
  label: string;
  value: string;
  onChange: (publisher: string) => void;
  current?: string;
}) => {
  const assignees = useAtomValue(territoryAssigneesState);
  const [query, setQuery] = useState('');

  const names = assignees.filter((item) => !item.group).map(({ name }) => name);
  const people =
    current && !names.includes(current) ? [...names, current] : names;

  return (
    <PublisherSearch
      label={label}
      options={people}
      value={value || null}
      onChange={(publisher) => onChange(publisher ?? '')}
      getName={(name) => name}
      onInputChange={setQuery}
      noOptionsText={<AddName name={query} group={false} onAdded={onChange} />}
    />
  );
};
