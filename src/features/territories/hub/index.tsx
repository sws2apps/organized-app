import { Box, Stack } from '@mui/material';
import {
  CustomDivider,
  ScrollableTabs,
  SearchBar,
  Typography,
} from '@components/index';
import { TerritoriesHubProps } from './index.types';
import Card from '@components/card';
import BoardView from '../components/board_view';
import AssignDialog from '../components/assign_dialog';
import MyHistory from '../components/my_history';
import ReturnDialog from '../components/return_dialog';
import SelectionBar from '../components/selection_bar';
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
  } = hub;

  const emptyMessage = [
    'Nothing to hand out right now.',
    'No territories match the filters.',
    'Nothing is assigned to you.',
    'No overdue territories.',
    'No open requests.',
  ][tab];

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
      emptyMessage={emptyMessage}
    />
  );

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: isBoard
          ? 'minmax(0, 1fr)'
          : {
              mobile: 'minmax(0, 1fr)',
              desktop: 'minmax(0, 1fr) 320px',
            },
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
        />
      )}

      <Card>
        <SearchBar
          placeholder="Search by number, name or city"
          value={filters.search}
          onSearch={(value: string) =>
            setFilters({ ...filters, search: value })
          }
        />

        <Box>
          <Stack
            direction="row"
            sx={{ alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}
          >
            {!isBoard && (
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <ScrollableTabs
                  appearance="plain"
                  tabs={tabs.map((item) => ({ ...item }))}
                  value={tab}
                  onChange={setTab}
                />
              </Box>
            )}
          </Stack>

          {!isBoard && <CustomDivider color="var(--accent-200)" />}

          {/* the 8px matches the table cell padding, so the text lines up
              with the checkbox and the column labels */}
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px',
              margin: '16px 0 4px',
              padding: '0 8px',
              minHeight: '38px',
            }}
          >
            <Typography className="h3">
              Territories: {(isBoard ? boardTerritories : visible).length}
            </Typography>

            {!isBoard && (
              <SelectionBar
                selected={selected}
                onAssignMany={() => setAssignManyOpen(true)}
                onReturnMany={returnMany}
              />
            )}
          </Stack>

          {content}

          {tabId === 'mine' && <MyHistory territories={territories} />}
        </Box>
      </Card>

      {!isBoard && (
        <Card>
          <TerritoryFilters filters={filters} onChange={setFilters} />
        </Card>
      )}
    </Box>
  );
};

export default TerritoriesHub;
