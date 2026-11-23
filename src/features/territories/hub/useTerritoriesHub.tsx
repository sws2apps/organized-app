import { territoryTabGroups } from '@features/territories/tabs';
import useTerritoryAccess from '@features/territories/useTerritoryAccess';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { useAtom, useAtomValue } from 'jotai';

import { useAppTranslation, useBreakpoints, useSubpane } from '@hooks/index';
import {
  territoriesShowHouseholdsState,
  territoriesState,
  territoriesWithStatusState,
  territoryLocalModeState,
  territoryOverdueMonthsState,
  territoryRecommendationsState,
} from '@states/territories';
import {
  applyFilters,
  EMPTY_FILTERS,
  forTab,
} from '@features/territories/helpers';
import { territoryCampaignsState } from '@features/territories/campaigns';
import { campaignsOn } from '@features/territories/campaign_dates';
import { inCampaign } from '@features/territories/campaign_filter';
import {
  AssignmentCard,
  AssignmentHolder,
  TerritoryAssignment,
  TerritoryFilters,
  TerritoryStatus,
  TerritoryTab,
} from '@definition/territory';
import useAssignReturn from '@features/territories/useAssignReturn';

const OWN_TABS = new Set<TerritoryTab>(['mine', 'group', 'requested']);

const BROWSE_TABS = new Set<TerritoryTab>(['recommended', 'all']);

const TAB_LABELS: Record<TerritoryTab, string> = {
  recommended: 'tr_territoryRecommended',
  all: 'tr_allTerritories',
  mine: 'tr_territoryAssigned',
  group: 'tr_myGroup',
  requested: 'tr_territoryRequested',
  requests: 'tr_territoryRequests',
};

const useTerritoriesHub = () => {
  const { t } = useAppTranslation();

  const navigate = useNavigate();

  const context = useTerritoryAccess();
  const {
    editor: isTerritoryEditor,
    access,
    publisher: me,
    groupHolder,
    restricted,
  } = context;

  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const territories = useAtomValue(territoriesState);
  const actions = useAssignReturn();
  const [showHouseholds, setShowHouseholds] = useAtom(
    territoriesShowHouseholdsState
  );
  const [overdueMonths, setOverdueMonths] = useAtom(
    territoryOverdueMonthsState
  );
  const localMode = useAtomValue(territoryLocalModeState);
  // the statistics open the list for one publisher's territories
  const [filters, setFilters] = useState<TerritoryFilters>(() => ({
    ...EMPTY_FILTERS,
    search: searchParams.get('search') ?? '',
  }));

  const searchFromUrl = searchParams.get('search') ?? '';
  useEffect(() => {
    setFilters((previous) => ({ ...previous, search: searchFromUrl }));
  }, [searchFromUrl]);

  const recommendations = useAtomValue(territoryRecommendationsState);
  const campaigns = useAtomValue(territoryCampaignsState);
  const running = campaignsOn(campaigns, new Date())[0];

  const withStatus = useAtomValue(territoriesWithStatusState);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [isBoard, setIsBoard] = useState(false);
  const [selecting, setSelecting] = useState(false);
  useEffect(() => {
    if (checked.size > 0) setSelecting(false);
  }, [checked]);
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [assignManyOpen, setAssignManyOpen] = useState(false);
  const [returnManyOpen, setReturnManyOpen] = useState(false);
  const { desktopUp } = useBreakpoints();

  // in the URL, so the device back gesture closes the filters on small screens
  const filtersPane = useSubpane('filters');
  // own territories have no filters, even with the flag left in the URL
  const filtersOpen =
    filtersPane.open && !OWN_TABS.has(searchParams.get('tab') as TerritoryTab);
  const setFiltersOpen = useCallback(
    (next: boolean) => filtersPane.setOpen(next, !desktopUp),
    [filtersPane, desktopUp]
  );

  const fromUrl = searchParams.get('tab') as TerritoryTab;

  const requested =
    fromUrl === 'requests' && !isTerritoryEditor ? 'requested' : fromUrl;

  const canBrowse = isTerritoryEditor || access !== 'own';
  const canRequest =
    !localMode && !!me && context.eligiblePublisher && access === 'request';

  const ownRequests = forTab(
    withStatus,
    'requested',
    me,
    isTerritoryEditor,
    groupHolder,
    restricted,
    { recommendations, identity: context }
  ).length;

  const tabGroups = territoryTabGroups(context, localMode, ownRequests > 0);

  const groupIndex = tabGroups.findIndex((item) => item.includes(requested));
  const group = tabGroups[Math.max(groupIndex, 0)];
  const tabId = group.includes(requested) ? requested : group[0];

  const isBrowsing = BROWSE_TABS.has(tabId);
  const tab = group.indexOf(tabId);

  const setTab = (next: number) => {
    searchParams.set('tab', group[next]);
    // keeps the entry's state, which tells an open pane how to close
    setSearchParams(searchParams, { replace: true, state: location.state });
  };

  const tabs =
    group.length > 1
      ? group.map((id) => ({
          label:
            id === 'all' && !isTerritoryEditor
              ? t('tr_territoryAvailable')
              : t(TAB_LABELS[id]),
          ...(id === 'requested' && ownRequests > 0
            ? { badge: ownRequests }
            : {}),
        }))
      : [];

  const campaignId = searchParams.get('campaign');
  const visibleBeforeCampaign = useMemo(() => {
    const list = forTab(
      withStatus,
      tabId,
      me,
      isTerritoryEditor,
      groupHolder,
      restricted,
      { recommendations, identity: context }
    );

    // own territories have no filters, so none left over from other tabs apply
    if (OWN_TABS.has(tabId)) return list;

    const filtered = applyFilters(list, filters);

    // during a special campaign, the ones it has not reached yet come first
    return tabId === 'recommended' && running
      ? filtered.sort(
          (a, b) =>
            Number(inCampaign(a, running.id)) -
            Number(inCampaign(b, running.id))
        )
      : filtered;
  }, [
    context,
    recommendations,
    withStatus,
    tabId,
    me,
    filters,
    isTerritoryEditor,
    groupHolder,
    restricted,
    running,
  ]);
  const visible = campaignId
    ? visibleBeforeCampaign.filter((territory) =>
        territory.assignments.some(
          (assignment) => assignment.campaign?.id === campaignId
        )
      )
    : visibleBeforeCampaign;

  // what the browse tabs can show between them; the list keeps all of it built
  const pool = useMemo(
    () =>
      isBrowsing
        ? forTab(
            withStatus,
            'all',
            me,
            isTerritoryEditor,
            groupHolder,
            restricted
          )
        : undefined,
    [isBrowsing, withStatus, me, isTerritoryEditor, groupHolder, restricted]
  );

  const boardTerritories = useMemo(
    () =>
      isTerritoryEditor
        ? applyFilters(withStatus, filters).filter(
            (item) => !campaignId || inCampaign(item, campaignId)
          )
        : [],
    [withStatus, filters, isTerritoryEditor, campaignId]
  );

  // a selection made in one view isn't carried, unseen, into another
  // an empty selection stays the same object, so a switch with nothing
  // checked doesn't render the whole list a second time
  useEffect(() => {
    setChecked((prev) => (prev.size ? new Set() : prev));
    setSelecting(false);
  }, [tabId, isBoard]);

  const byId = new Map(visible.map((territory) => [territory.id, territory]));
  const selected = Array.from(checked).flatMap((id) => {
    const territory = byId.get(id);
    return territory ? [territory] : [];
  });

  const handleDrop = (id: string, status: TerritoryStatus) => {
    if (!isTerritoryEditor) return;
    const current = withStatus.find((territory) => territory.id === id);
    if (!current) return;

    const isOut = (value: TerritoryStatus) =>
      value === 'in_work' || value === 'overdue';

    if (isOut(current.status) && isOut(status)) return;

    if (status === 'in_work') {
      actions.openAssign(id);
      return;
    }

    if (status === 'available') actions.openReturn(id);
  };

  const toggleCheck = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleCheckMany = (ids: string[]) =>
    setChecked((prev) => {
      const everyChecked = ids.length > 0 && ids.every((id) => prev.has(id));
      const next = new Set(prev);
      ids.forEach((id) => (everyChecked ? next.delete(id) : next.add(id)));
      return next;
    });

  const clearChecked = () => {
    setChecked(new Set());
    setSelecting(false);
  };

  const assignMany = (
    holder: AssignmentHolder,
    assignedOn?: Date,
    campaign?: TerritoryAssignment['campaign'] | null,
    card?: AssignmentCard,
    note?: string
  ) => {
    const ids = selected
      .filter((territory) => territory.status === 'available')
      .map((territory) => territory.id);

    if (!actions.assignMany(ids, holder, assignedOn, campaign, card, note))
      return false;

    setAssignManyOpen(false);
    clearChecked();
    return true;
  };

  const returnable = selected.filter(
    (territory) =>
      territory.status === 'in_work' || territory.status === 'overdue'
  );

  const returnMany = (returnedOn: Date, publisher?: string) => {
    const returned = actions.returnMany(
      returnable.map((territory) => territory.id),
      returnedOn,
      publisher
    );

    if (!returned) return;
    setReturnManyOpen(false);
    clearChecked();
  };

  const title = t(
    {
      recommended: isTerritoryEditor
        ? 'tr_allTerritories'
        : 'tr_territoryGetTerritory',
      all: isTerritoryEditor ? 'tr_allTerritories' : 'tr_territoryGetTerritory',
      mine: 'tr_myTerritories',
      group: 'tr_myTerritories',
      requested: 'tr_myTerritories',
      requests: 'tr_territoryRequests',
    }[tabId]
  );

  const handleOpen = (id: string) =>
    navigate(`/territories/${id}`, { state: { parent: title } });

  return {
    tab,
    tabId,
    isBrowsing,
    isOwnTab: OWN_TABS.has(tabId),
    isTerritoryEditor,
    canBrowse,
    canRequest,
    canReturn: access === 'request',
    setTab,
    tabs,
    filters,
    setFilters,
    filtersOpen,
    setFiltersOpen,
    running,
    visible,
    boardTerritories,
    pool,
    territories,
    selected,
    checked,
    toggleCheck,
    toggleCheckMany,
    clearChecked,
    assignMany,
    returnMany,
    actions,
    handleDecline: actions.handleDecline,
    handleOpen,
    title,
    isBoard,
    setIsBoard,
    selecting,
    setSelecting,
    quickSettingsOpen,
    setQuickSettingsOpen,
    showHouseholds,
    setShowHouseholds,
    overdueMonths,
    setOverdueMonths,
    setReturnId: actions.openReturn,
    setAssignId: actions.openAssign,
    assignManyOpen,
    setAssignManyOpen,
    returnManyOpen,
    setReturnManyOpen,
    returnable,
    assignableCount: selected.filter(
      (territory) => territory.status === 'available'
    ).length,
    handleDrop,
  };
};

export default useTerritoriesHub;
