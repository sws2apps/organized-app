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
        <Stack direction="row" sx={{ alignItems: 'center', gap: '16px' }}>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <SearchBar
              placeholder="Search territories"
              value={filters.search}
              onSearch={(value: string) =>
                setFilters({ ...filters, search: value })
              }
            />
          </Box>

          {!isBoard && (
            <Button
              variant="secondary"
              disableAutoStretch
              sx={{ flexShrink: 0 }}
              onClick={() => setFiltersOpen(!filtersOpen)}
              endIcon={filtersOpen ? <IconPanelOpen /> : <IconPanelClose />}
            >
              {applied ? `Filters (${applied})` : 'Filters'}
            </Button>
          )}
        </Stack>
      )}

      <Box>
        {(tabs.length > 0 || inlineSwitch) && (
          <>
            <Stack
              direction="row"
              sx={{ alignItems: 'center', gap: '8px', minHeight: '48px' }}
            >
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                {!isBoard && tabs.length > 0 && (
                  <ScrollableTabs
                    appearance="plain"
                    tabs={tabs.map((item) => ({ ...item }))}
                    value={tab}
                    onChange={setTab}
                  />
                )}
              </Box>

              {inlineSwitch}
            </Stack>

            <CustomDivider color="var(--accent-200)" />
          </>
        )}

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
          desktopUp && (filtersInline || tabId === 'mine')
            ? 'minmax(0, 1fr) 360px'
            : 'minmax(0, 1fr)',
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
          title={`Assign ${assignableCount} ${
            assignableCount === 1 ? 'territory' : 'territories'
          }`}
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
                <Card>
                  <TerritoryFilters
                    filters={filters}
                    onChange={setFilters}
                    showTitle={false}
                    showClear={false}
                  />

                  <DialogActions>
                    <Button
                      variant="secondary"
                      disabled={applied === 0}
                      onClick={() => setFilters(clearedFilters(filters))}
                    >
                      Clear all
                    </Button>
                    <Button variant="main" onClick={closeFilters}>
                      {`Show ${visible.length} ${
                        visible.length === 1 ? 'territory' : 'territories'
                      }`}
                    </Button>
                  </DialogActions>
                </Card>
              ),
            },
          ]}
        />
      )}

      {(filtersInline || tabId === 'mine') && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtersInline && (
            <Card>
              <TerritoryFilters filters={filters} onChange={setFilters} />
            </Card>
          )}

          {tabId === 'mine' && (
            <Box
              sx={{
                padding: '16px',
                backgroundColor: 'var(--accent-150)',
                ...dashedBorder({ radius: 12 }),
              }}
            >
              <MyHistory territories={territories} />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default TerritoriesHub;
