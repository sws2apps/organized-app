import { ReactNode } from 'react';
import { Box, Stack } from '@mui/material';
import {
  Button,
  CustomDivider,
  ScrollableTabs,
  SearchBar,
  Typography,
} from '@components/index';
import PaneSwitcher from '@components/pane_switcher';
import {
  IconInformationBoard,
  IconListView,
  IconPanelClose,
  IconPanelOpen,
} from '@icons/index';
import TabSwitcher from '@components/tab_switcher';
import { useBreakpoints } from '@hooks/index';
import {
  appliedFilters,
  clearedFilters,
  emptyListMessage,
  NO_MATCHES,
} from '../helpers';
import { TerritoriesHubProps } from './index.types';
import {
  Territory,
  TerritoryFilters as TerritoryFiltersType,
} from '@definition/territory';
import Card from '@components/card';
import BoardView from '../components/board_view';
import AssignDialog from '../components/assign_dialog';
import MyHistory from '../components/my_history';
import ReturnDialog from '../components/return_dialog';
import SelectionBar from '../components/selection_bar';
import DialogActions from '@components/dialog_actions';
import dashedBorder from '@utils/dashed_border';
import TerritoryFilters from '../components/territory_filters';
import TerritoryTable from '../components/territory_table';

const plural = (count: number) => (count === 1 ? 'territory' : 'territories');

const SearchRow = ({
  search,
  onSearch,
  showFiltersButton,
  filtersOpen,
  applied,
  onToggleFilters,
}: {
  search: string;
  onSearch: (value: string) => void;
  showFiltersButton: boolean;
  filtersOpen: boolean;
  applied: number;
  onToggleFilters: VoidFunction;
}) => (
  <Stack direction="row" sx={{ alignItems: 'center', gap: '16px' }}>
    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
      <SearchBar
        placeholder="Search territories"
        value={search}
        onSearch={onSearch}
      />
    </Box>

    {showFiltersButton && (
      <Button
        variant="secondary"
        disableAutoStretch
        sx={{ flexShrink: 0 }}
        onClick={onToggleFilters}
        endIcon={filtersOpen ? <IconPanelOpen /> : <IconPanelClose />}
      >
        {applied ? `Filters (${applied})` : 'Filters'}
      </Button>
    )}
  </Stack>
);

const FiltersPane = ({
  filters,
  onChange,
  applied,
  count,
  onClose,
}: {
  filters: TerritoryFiltersType;
  onChange: (filters: TerritoryFiltersType) => void;
  applied: number;
  count: number;
  onClose: VoidFunction;
}) => (
  <Card>
    <TerritoryFilters
      filters={filters}
      onChange={onChange}
      showTitle={false}
      showClear={false}
    />

    <DialogActions>
      <Button
        variant="secondary"
        disabled={applied === 0}
        onClick={() => onChange(clearedFilters(filters))}
      >
        Clear all
      </Button>
      <Button variant="main" onClick={onClose}>
        {`Show ${count} ${plural(count)}`}
      </Button>
    </DialogActions>
  </Card>
);

const SidePanel = ({
  filters,
  onChange,
  showFilters,
  history,
}: {
  filters: TerritoryFiltersType;
  onChange: (filters: TerritoryFiltersType) => void;
  showFilters: boolean;
  history?: Territory[];
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    {showFilters && (
      <Card>
        <TerritoryFilters filters={filters} onChange={onChange} />
      </Card>
    )}

    {history && (
      <Box
        sx={{
          padding: '16px',
          backgroundColor: 'var(--accent-150)',
          ...dashedBorder({ radius: 12 }),
        }}
      >
        <MyHistory territories={history} />
      </Box>
    )}
  </Box>
);

const TabsRow = ({
  tabs,
  value,
  onChange,
  aside,
}: {
  tabs: TerritoriesHubProps['hub']['tabs'];
  value: number;
  onChange: (value: number) => void;
  aside?: ReactNode;
}) => {
  if (tabs.length === 0 && !aside) return null;

  return (
    <>
      <Stack
        direction="row"
        sx={{ alignItems: 'center', gap: '8px', minHeight: '48px' }}
      >
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          {tabs.length > 0 && (
            <ScrollableTabs
              appearance="plain"
              tabs={tabs.map((item) => ({ ...item }))}
              value={value}
              onChange={onChange}
            />
          )}
        </Box>

        {aside}
      </Stack>

      <CustomDivider color="var(--accent-200)" />
    </>
  );
};

const TerritoriesHub = ({ hub }: TerritoriesHubProps) => {
  const {
    tab,
    tabId,
    setTab,
    tabs,
    filters,
    setFilters,
    visible,
    boardTerritories,
    territories,
    selected,
    checked,
    toggleCheck,
    toggleCheckMany,
    assignMany,
    returnMany,
    handleAssign,
    handleDecline,
    handleReturn,
    handleOpen,
    isBoard,
    showHouseholds,
    setReturnId,
    returnTarget,
    setAssignId,
    assignTarget,
    assignManyOpen,
    setAssignManyOpen,
    assignableCount,
    handleDrop,
    isBrowsing,
    isOwnTab: isMine,
    isTerritoryEditor,
    setIsBoard,
  } = hub;

  const { desktopUp, tablet688Up } = useBreakpoints();

  const { filtersOpen, setFiltersOpen } = hub;

  const applied = appliedFilters(filters);

  const filtersInline = desktopUp && !isBoard && !isMine && filtersOpen;

  const hasSidePanel = filtersInline || tabId === 'mine';

  const closeFilters = () => {
    setFiltersOpen(false);
    window.scroll({ top: 0 });
  };

  // a search or filter explains an empty list; otherwise it's simply empty
  const emptyMessage =
    !isMine && (applied > 0 || filters.search.trim())
      ? NO_MATCHES
      : emptyListMessage();

  const canSwitchLayout = isTerritoryEditor && isBrowsing;

  const layoutSwitch = canSwitchLayout && (
    <TabSwitcher
      ariaLabel="Layout"
      surface="light"
      value={isBoard ? 'board' : 'list'}
      onChange={(value) => setIsBoard(value === 'board')}
      options={[
        { value: 'list', label: 'List', icon: <IconListView /> },
        { value: 'board', label: 'Board', icon: <IconInformationBoard /> },
      ]}
      sx={{ width: tablet688Up ? '240px' : '100%', flexShrink: 0 }}
    />
  );

  const inlineSwitch = tablet688Up ? layoutSwitch : undefined;

  const content = isBoard ? (
    <BoardView
      territories={boardTerritories}
      onOpen={handleOpen}
      onOpenAssign={setAssignId}
      onAssign={handleAssign}
      onDecline={handleDecline}
      onReturn={setReturnId}
      onDrop={handleDrop}
      showHouseholds={showHouseholds}
      overdueMonths={hub.overdueMonths}
    />
  ) : (
    <TerritoryTable
      territories={visible}
      checked={checked}
      onCheck={toggleCheck}
      onCheckMany={toggleCheckMany}
      onOpen={handleOpen}
      onOpenAssign={setAssignId}
      onAssign={handleAssign}
      onDecline={handleDecline}
      onReturn={setReturnId}
      showHouseholds={showHouseholds}
      showRequested={tabId !== 'requests' && tabId !== 'requested'}
      actions={isTerritoryEditor || (!isBrowsing && hub.canRequest)}
      showHolder={isTerritoryEditor}
      emptyMessage={emptyMessage}
      title={`Territories: ${visible.length}`}
      selectionBar={
        <SelectionBar
          selected={selected}
          onAssignMany={() => setAssignManyOpen(true)}
          onReturnMany={returnMany}
        />
      }
    />
  );

  const listCard = (
    <Card>
      {!tablet688Up && layoutSwitch}

      {!isMine && (
        <SearchRow
          search={filters.search}
          onSearch={(value) => setFilters({ ...filters, search: value })}
          showFiltersButton={!isBoard}
          filtersOpen={filtersOpen}
          applied={applied}
          onToggleFilters={() => setFiltersOpen(!filtersOpen)}
        />
      )}

      <Box>
        <TabsRow
          tabs={isBoard ? [] : tabs}
          value={tab}
          onChange={setTab}
          aside={inlineSwitch}
        />

        {isBoard && (
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '16px 8px 8px',
              minHeight: '44px',
            }}
          >
            <Typography className="h3" noWrap>
              Territories: {boardTerritories.length}
            </Typography>
          </Stack>
        )}

        {content}
      </Box>
    </Card>
  );

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns:
          desktopUp && hasSidePanel ? 'minmax(0, 1fr) 360px' : 'minmax(0, 1fr)',
        gap: '16px',
        alignItems: 'start',
      }}
    >
      {/* both dialogs mount per territory so their fields start from it */}
      {assignTarget && (
        <AssignDialog
          title={`Assign ${assignTarget.number}`}
          subtitle={`${assignTarget.name} · ${assignTarget.city}`}
          requestedBy={assignTarget.requestedBy}
          territories={territories}
          onClose={() => setAssignId(undefined)}
          onAssign={(publisher, assignedOn) =>
            handleAssign(assignTarget.id, publisher, assignedOn)
          }
        />
      )}

      {assignManyOpen && (
        <AssignDialog
          title={`Assign ${assignableCount} ${plural(assignableCount)}`}
          territories={territories}
          onClose={() => setAssignManyOpen(false)}
          onAssign={assignMany}
        />
      )}

      {returnTarget && (
        <ReturnDialog
          territory={returnTarget}
          onClose={() => setReturnId(undefined)}
          onReturn={handleReturn}
          onAssignAgain={handleAssign}
        />
      )}

      {desktopUp || isBoard ? (
        listCard
      ) : (
        <PaneSwitcher
          fullBleed
          value={filtersOpen ? 1 : 0}
          panes={[
            { key: 'list', content: listCard },
            {
              key: 'filters',
              content: (
                <FiltersPane
                  filters={filters}
                  onChange={setFilters}
                  applied={applied}
                  count={visible.length}
                  onClose={closeFilters}
                />
              ),
            },
          ]}
        />
      )}

      {hasSidePanel && (
        <SidePanel
          filters={filters}
          onChange={setFilters}
          showFilters={filtersInline}
          history={tabId === 'mine' ? territories : undefined}
        />
      )}
    </Box>
  );
};

export default TerritoriesHub;
