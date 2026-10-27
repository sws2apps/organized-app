import {
  ReactNode,
  useLayoutEffect,
  useMemo,
  useDeferredValue,
  useTransition,
  useRef,
} from 'react';
import { Box, Collapse, Fade, Stack } from '@mui/material';
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
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import {
  appliedFilters,
  clearedFilters,
  emptyListMessage,
  NO_MATCHES,
} from '@features/territories/helpers';
import { TerritoriesHubProps } from '@features/territories/hub/index.types';
import {
  Territory,
  TerritoryFilters as TerritoryFiltersType,
  TerritoryStatus,
} from '@definition/territory';
import Card from '@components/card';
import BoardView from '@features/territories/components/board_view';
import CampaignBanner from '@features/territories/components/campaign_banner';
import AssignDialog from '@features/territories/components/assign_dialog';
import AssignReturnDialogs from '@features/territories/components/assign_return_dialogs';
import ReturnManyDialog from '@features/territories/components/return_many_dialog';
import MyHistory from '@features/territories/components/my_history';
import SelectionBar from '@features/territories/components/selection_bar';
import DialogActions from '@components/dialog_actions';
import dashedBorder from '@utils/dashed_border';
import {
  DURATION_MEDIUM,
  DURATION_SHORT,
  EASE_STANDARD,
  useSlideIn,
} from '@utils/motion';
import TerritoryFilters from '@features/territories/components/territory_filters';
import TerritoryTable from '@features/territories/components/territory_table';

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
}) => {
  const { t } = useAppTranslation();
  return (
    <Stack direction="row" sx={{ alignItems: 'center' }}>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <SearchBar
          placeholder={t('tr_territorySearchTerritories')}
          value={search}
          onSearch={onSearch}
        />
      </Box>

      {/* the button folds away sideways, so the search widens smoothly */}
      <Collapse
        orientation="horizontal"
        in={showFiltersButton}
        timeout={DURATION_MEDIUM}
        easing={EASE_STANDARD}
        inert={!showFiltersButton}
        sx={{ flexShrink: 0 }}
      >
        <Button
          variant="secondary"
          disableAutoStretch
          sx={{ flexShrink: 0, marginLeft: '16px' }}
          onClick={onToggleFilters}
          endIcon={filtersOpen ? <IconPanelOpen /> : <IconPanelClose />}
        >
          {t('tr_filters')}
          {/* how many are on, as the tabs show their counts */}
          {applied > 0 && (
            <Box
              component="span"
              className="label-small-semibold"
              sx={{
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                minWidth: '20px',
                height: '20px',
                marginLeft: '8px',
                padding: '0 5px',
                borderRadius: 'var(--radius-s)',
                backgroundColor: 'var(--accent-150)',
                color: 'var(--accent-dark)',
              }}
            >
              {applied}
            </Box>
          )}
        </Button>
      </Collapse>
    </Stack>
  );
};

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
}) => {
  const { t } = useAppTranslation();
  return (
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
          {t('tr_clearAll')}
        </Button>
        <Button variant="main" onClick={onClose}>
          {t('tr_territoryShowCount', { count })}
        </Button>
      </DialogActions>
    </Card>
  );
};

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
          // the cards' 1px border plus their 16px padding: the dashed line is
          // drawn inside the box, so their titles and this one line up
          padding: '17px',
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
  tabsShown = true,
}: {
  tabs: TerritoriesHubProps['hub']['tabs'];
  value: number;
  onChange: (value: number) => void;
  aside?: ReactNode;
  // hidden tabs fade but keep their row, so nothing below moves
  tabsShown?: boolean;
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
            <Fade in={tabsShown} timeout={DURATION_SHORT}>
              <Box inert={!tabsShown}>
                <ScrollableTabs
                  appearance="plain"
                  tabs={tabs.map((item) => ({ ...item }))}
                  value={value}
                  onChange={onChange}
                />
              </Box>
            </Fade>
          )}
        </Box>

        {aside}
      </Stack>

      <CustomDivider color="var(--accent-200)" />
    </>
  );
};

const LayoutSwitch = ({ hub }: TerritoriesHubProps) => {
  const { t } = useAppTranslation();
  const { tablet688Up } = useBreakpoints();
  return (
    <TabSwitcher
      ariaLabel={t('tr_territoryLayout')}
      surface="light"
      value={hub.isBoard ? 'board' : 'list'}
      onChange={(value) => hub.setIsBoard(value === 'board')}
      options={[
        { value: 'list', label: t('tr_territoryList'), icon: <IconListView /> },
        {
          value: 'board',
          label: t('tr_territoryBoard'),
          icon: <IconInformationBoard />,
        },
      ]}
      sx={{ width: tablet688Up ? '240px' : '100%', flexShrink: 0 }}
    />
  );
};

const HubPane = ({
  hub,
  children,
  isBoard,
  applied,
  closeFilters,
}: TerritoriesHubProps & {
  children: ReactNode;
  isBoard: boolean;
  applied: number;
  closeFilters: VoidFunction;
}) => {
  const { desktopUp } = useBreakpoints();
  if (desktopUp) return <>{children}</>;
  return (
    <PaneSwitcher
      sx={{ gridTemplateColumns: 'minmax(0, 1fr)' }}
      fullBleed
      value={hub.filtersOpen && !isBoard ? 1 : 0}
      panes={[
        { key: 'list', content: children },
        {
          key: 'filters',
          content: (
            <FiltersPane
              filters={hub.filters}
              onChange={hub.setFilters}
              applied={applied}
              count={hub.visible.length}
              onClose={closeFilters}
            />
          ),
        },
      ]}
    />
  );
};

const TerritoryLayouts = ({
  isBoard,
  canSwitchLayout,
  list,
  board,
}: {
  isBoard: boolean;
  canSwitchLayout: boolean;
  list: ReactNode;
  board: ReactNode;
}) => {
  const activeView = isBoard ? board : list;
  return canSwitchLayout ? (
    <>
      <Box hidden={isBoard}>{list}</Box>
      <Box hidden={!isBoard}>{board}</Box>
    </>
  ) : (
    activeView
  );
};

const TerritoriesHub = ({ hub }: TerritoriesHubProps) => {
  const { t } = useAppTranslation();

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
    handleDecline,
    handleOpen,
    showHouseholds,
    setReturnId,
    setAssignId,
    assignManyOpen,
    setAssignManyOpen,
    returnManyOpen,
    setReturnManyOpen,
    returnable,
    assignableCount,
    isBrowsing,
    isOwnTab: isMine,
    isTerritoryEditor,
    pool,
  } = hub;

  // stable handlers for the memoized board, reaching the newest hub
  const latest = useRef(hub);
  useLayoutEffect(() => {
    latest.current = hub;
  });
  const boardHandlers = useMemo(
    () => ({
      open: (id: string) => latest.current.handleOpen(id),
      assign: (id: string) => latest.current.setAssignId(id),
      decline: (id: string) => latest.current.handleDecline(id),
      return: (id: string) => latest.current.setReturnId(id),
      drop: (id: string, status: TerritoryStatus) =>
        latest.current.handleDrop(id, status),
    }),
    []
  );

  // React's standard split: the switch follows the click at once, the
  // views follow the deferred value, rendered without blocking the slide
  const isBoard = useDeferredValue(hub.isBoard);

  const { desktopUp, tablet688Up } = useBreakpoints();

  // tabs, then the board after them: each change slides in from its side
  const slide = useSlideIn(isBoard ? tabs.length : tab);

  // while the next tab renders, the current one already fades back, so the
  // swap reads as one motion instead of a pause and a jump
  const [switching, startSwitch] = useTransition();
  const switchTab = (next: number) => startSwitch(() => setTab(next));

  const manyDoNotCalls = selected
    .filter((territory) => territory.status === 'available')
    .reduce((sum, territory) => sum + territory.doNotCalls.length, 0);

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
      ? t(NO_MATCHES)
      : emptyListMessage();

  const canSwitchLayout = isTerritoryEditor && isBrowsing;

  const layoutSwitch = canSwitchLayout && <LayoutSwitch hub={hub} />;

  const inlineSwitch = tablet688Up ? layoutSwitch : undefined;

  const selectionBar = selected.length > 0 && (
    <SelectionBar
      selected={selected}
      onAssignMany={() => setAssignManyOpen(true)}
      onReturnMany={() => setReturnManyOpen(true)}
      onClear={hub.clearChecked}
    />
  );

  const board = (
    <BoardView
      territories={boardTerritories}
      onOpen={boardHandlers.open}
      onOpenAssign={boardHandlers.assign}
      onDecline={boardHandlers.decline}
      onReturn={boardHandlers.return}
      onDrop={boardHandlers.drop}
      showHouseholds={showHouseholds}
      overdueMonths={hub.overdueMonths}
    />
  );

  const list = (
    <TerritoryTable
      territories={visible}
      checked={checked}
      selecting={hub.selecting}
      onSelectingChange={hub.setSelecting}
      onCheck={toggleCheck}
      onCheckMany={toggleCheckMany}
      onOpen={handleOpen}
      onOpenAssign={setAssignId}
      onDecline={handleDecline}
      onReturn={setReturnId}
      showHouseholds={showHouseholds}
      showRequested={tabId !== 'requests' && tabId !== 'requested'}
      actions={
        isTerritoryEditor ||
        ((tabId === 'mine' || tabId === 'group') && hub.canReturn)
      }
      showHolder={isTerritoryEditor && tabId !== 'mine'}
      showDoNotCalls={isTerritoryEditor}
      emptyMessage={emptyMessage}
      title={t('tr_territoryTerritories', { n: visible.length })}
      titleOnTop={isMine && tabs.length === 0}
      selectionBar={selectionBar}
      pool={pool}
    />
  );

  // both views stay mounted and only hide, so a switch is one attribute
  // change instead of building or reconnecting a whole view
  const content = (
    <TerritoryLayouts
      isBoard={isBoard}
      canSwitchLayout={canSwitchLayout}
      list={list}
      board={board}
    />
  );

  const listCard = (
    <Card>
      {!tablet688Up && layoutSwitch}

      {!isMine && (
        <SearchRow
          search={filters.search}
          onSearch={(value) => setFilters({ ...filters, search: value })}
          showFiltersButton={!hub.isBoard}
          filtersOpen={filtersOpen}
          applied={applied}
          onToggleFilters={() => setFiltersOpen(!filtersOpen)}
        />
      )}

      {!isMine && hub.running && (
        <CampaignBanner
          campaign={hub.running}
          territories={territories}
          filters={filters}
          onChange={setFilters}
        />
      )}

      <Box>
        <TabsRow
          tabs={tabs}
          tabsShown={!hub.isBoard}
          value={tab}
          onChange={switchTab}
          aside={inlineSwitch}
        />

        <Box
          ref={slide}
          sx={{
            opacity: switching || isBoard !== hub.isBoard ? 0.6 : 1,
            transition: `opacity ${DURATION_SHORT}ms ${EASE_STANDARD}`,
          }}
        >
          {isBoard && (
            <Stack
              direction="row"
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                // the list's heading row, so the title stays put on a switch
                padding: '12px 8px 8px',
                minHeight: '40px',
                boxSizing: 'content-box',
              }}
            >
              <Typography className="h3" noWrap>
                {t('tr_territoryTerritories', { n: boardTerritories.length })}
              </Typography>
              {selectionBar}
            </Stack>
          )}

          {content}
        </Box>
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
      <AssignReturnDialogs
        actions={hub.actions}
        canAssign={isTerritoryEditor}
      />

      {isTerritoryEditor && assignManyOpen && (
        <AssignDialog
          title={t('tr_territoryAssignCount', { count: assignableCount })}
          doNotCalls={manyDoNotCalls}
          onClose={() => setAssignManyOpen(false)}
          onAssign={assignMany}
        />
      )}

      {(isTerritoryEditor || hub.canReturn) && returnManyOpen && (
        <ReturnManyDialog
          territories={returnable}
          own={!isTerritoryEditor}
          onClose={() => setReturnManyOpen(false)}
          onReturn={returnMany}
        />
      )}

      {/* the board keeps the same tree as the list, so the layout switch
          stays mounted and slides between the two */}
      <HubPane
        hub={hub}
        isBoard={isBoard}
        applied={applied}
        closeFilters={closeFilters}
      >
        {listCard}
      </HubPane>

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
