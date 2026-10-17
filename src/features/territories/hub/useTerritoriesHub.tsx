import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { useAtom, useAtomValue } from 'jotai';
import {
  territoryAccessState,
  territoryRestrictedCategoriesState,
  territoryRestrictedTypesState,
  userLocalUIDState,
} from '@states/settings';
import { useBreakpoints, useCurrentUser, useSubpane } from '@hooks/index';
import {
  territoriesShowHouseholdsState,
  territoriesState,
  territoryOverdueMonthsState,
} from '@states/territories';
import {
  applyFilters,
  EMPTY_FILTERS,
  forTab,
  groupHolderName,
  withDerivedStatus,
  assignmentFromDates,
  parseDate,
} from '../helpers';
import {
  Territory,
  TerritoryFilters,
  TerritoryStatus,
  TerritoryTab,
} from '@definition/territory';

const TAB_GROUPS: TerritoryTab[][] = [
  ['recommended', 'all'],
  ['mine', 'group', 'requested'],
  ['requests'],
];

const OWN_TABS = new Set<TerritoryTab>(['mine', 'group', 'requested']);

const BROWSE_TABS = new Set<TerritoryTab>(['recommended', 'all']);

const TAB_LABELS: Record<TerritoryTab, string> = {
  recommended: 'Recommended',
  all: 'All territories',
  mine: 'Assigned',
  group: 'My group',
  requested: 'Requested',
  requests: 'Requests',
};

const useTerritoriesHub = () => {
  const navigate = useNavigate();

  const { isElder, isServiceCommittee, my_group } = useCurrentUser();

  const isTerritoryEditor = isElder || isServiceCommittee;

  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const [territories, setTerritories] = useAtom(territoriesState);
  const [showHouseholds, setShowHouseholds] = useAtom(
    territoriesShowHouseholdsState
  );
  const [overdueMonths, setOverdueMonths] = useAtom(
    territoryOverdueMonthsState
  );
  const access = useAtomValue(territoryAccessState);
  const restrictedCategories = useAtomValue(territoryRestrictedCategoriesState);
  const restrictedTypes = useAtomValue(territoryRestrictedTypesState);

  const [filters, setFilters] = useState<TerritoryFilters>(EMPTY_FILTERS);

  const restricted = useMemo(
    () => ({ categories: restrictedCategories, types: restrictedTypes }),
    [restrictedCategories, restrictedTypes]
  );

  const withStatus = useMemo(
    () => withDerivedStatus(territories, overdueMonths),
    [territories, overdueMonths]
  );
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [isBoard, setIsBoard] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [returnId, setReturnId] = useState<string | undefined>();
  const [assignId, setAssignId] = useState<string | undefined>();
  const [assignManyOpen, setAssignManyOpen] = useState(false);
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

  const userUID = useAtomValue(userLocalUIDState);

  const isGroupLead = !!my_group?.group_data.members.some(
    (member) =>
      member.person_uid === userUID && (member.isOverseer || member.isAssistant)
  );

  const groupHolder =
    isGroupLead && my_group ? groupHolderName(my_group.group_data) : undefined;

  const canBrowse = isTerritoryEditor || access !== 'own';
  const canRequest = isTerritoryEditor || access === 'request';

  const tabGroups = TAB_GROUPS.map((ids) =>
    ids.filter(
      (id) =>
        (id !== 'group' || groupHolder) &&
        (canBrowse || !BROWSE_TABS.has(id)) &&
        (canRequest || id !== 'requested')
    )
  ).filter((ids) => ids.length > 0);

  const groupIndex = tabGroups.findIndex((item) => item.includes(requested));
  const group = tabGroups[Math.max(groupIndex, 0)];
  const tabId = group.includes(requested) ? requested : group[0];

  const isBrowsing = group === tabGroups[0];
  const tab = group.indexOf(tabId);

  useEffect(() => {
    setChecked(new Set());
  }, [tabId]);

  const setTab = (next: number) => {
    searchParams.set('tab', group[next]);
    // keeps the entry's state, which tells an open pane how to close
    setSearchParams(searchParams, { replace: true, state: location.state });
  };

  const ownRequests = forTab(withStatus, 'requested').length;

  const tabs =
    group.length > 1
      ? group.map((id) => ({
          label:
            id === 'all' && !isTerritoryEditor ? 'Available' : TAB_LABELS[id],
          ...(id === 'requested' && ownRequests > 0
            ? { badge: ownRequests }
            : {}),
        }))
      : [];

  const visible = useMemo(() => {
    const list = forTab(
      withStatus,
      tabId,
      isTerritoryEditor,
      groupHolder,
      restricted
    );

    // own territories have no filters, so none left over from other tabs apply
    if (OWN_TABS.has(tabId)) return list;

    return applyFilters(list, filters);
  }, [withStatus, tabId, filters, isTerritoryEditor, groupHolder, restricted]);

  const boardTerritories = useMemo(
    () => applyFilters(withStatus, filters),
    [withStatus, filters]
  );

  // rows hidden by the filters stay out of bulk actions
  const selected = visible.filter((territory) => checked.has(territory.id));

  const patch = (
    id: string,
    changes: (territory: Territory) => Partial<Territory>
  ) =>
    setTerritories((prev) =>
      prev.map((territory) =>
        territory.id === id
          ? { ...territory, ...changes(territory) }
          : territory
      )
    );

  const handleAssign = (id: string, publisher: string, assignedOn?: Date) => {
    const start = assignedOn ?? new Date();
    const days = Math.max(
      0,
      Math.round((Date.now() - start.getTime()) / 86400000)
    );

    patch(id, (territory) => ({
      status: 'in_work',
      holder: publisher,
      daysOut: days,
      requestedBy: undefined,
      reviewNeeded: false,
      assignments: [
        ...territory.assignments.map((item) =>
          item.returnedOn
            ? item
            : assignmentFromDates(
                item,
                item.publisher,
                parseDate(item.assignedOn) ?? start,
                start
              )
        ),
        assignmentFromDates(
          {
            id: `ta-${Date.now()}-${id}`,
            publisher,
            assignedOn: '',
            serviceYear: 0,
            months: 0,
            startMonth: 0,
            endMonth: 0,
          },
          publisher,
          start,
          null
        ),
      ],
    }));
  };

  const handleDecline = (id: string) =>
    patch(id, () => ({ requestedBy: undefined }));

  const handleReturn = (id: string, households?: number, returnedOn?: Date) => {
    const end = returnedOn ?? new Date();
    const days = Math.max(
      0,
      Math.round((Date.now() - end.getTime()) / 86400000)
    );

    patch(id, (territory) => ({
      status: 'available',
      holder: undefined,
      daysOut: undefined,
      daysSinceCovered: days,
      reviewNeeded: households === undefined,
      ...(households === undefined ? {} : { households }),
      assignments: territory.assignments.map((item) =>
        item.returnedOn
          ? item
          : assignmentFromDates(
              item,
              item.publisher,
              parseDate(item.assignedOn) ?? end,
              end
            )
      ),
    }));
  };

  const handleDrop = (id: string, status: TerritoryStatus) => {
    const current = withStatus.find((territory) => territory.id === id);
    if (!current) return;

    const isOut = (value: TerritoryStatus) =>
      value === 'in_work' || value === 'overdue';

    if (isOut(current.status) && isOut(status)) return;

    if (status === 'in_work') {
      setAssignId(id);
      return;
    }

    if (status === 'available') setReturnId(id);
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

  const assignMany = (publisher: string, assignedOn?: Date) => {
    selected
      .filter((territory) => territory.status === 'available')
      .forEach((territory) =>
        handleAssign(territory.id, publisher, assignedOn)
      );

    setAssignManyOpen(false);
    clearChecked();
  };

  const returnMany = () => {
    selected
      .filter(
        (territory) =>
          territory.status === 'in_work' || territory.status === 'overdue'
      )
      .forEach((territory) => handleReturn(territory.id));

    clearChecked();
  };

  const title = {
    recommended: isTerritoryEditor ? 'All territories' : 'Get territory',
    all: isTerritoryEditor ? 'All territories' : 'Get territory',
    mine: 'My territories',
    group: 'My territories',
    requested: 'My territories',
    requests: 'Requests',
  }[tabId];

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
    setTab,
    tabs,
    filters,
    setFilters,
    filtersOpen,
    setFiltersOpen,
    visible,
    boardTerritories,
    territories,
    selected,
    checked,
    toggleCheck,
    toggleCheckMany,
    clearChecked,
    assignMany,
    returnMany,
    handleAssign,
    handleDecline,
    handleReturn,
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
    returnId,
    setReturnId,
    assignId,
    setAssignId,
    assignManyOpen,
    setAssignManyOpen,
    assignableCount: selected.filter(
      (territory) => territory.status === 'available'
    ).length,
    assignTarget: territories.find((territory) => territory.id === assignId),
    handleDrop,
    returnTarget: territories.find((territory) => territory.id === returnId),
  };
};

export default useTerritoriesHub;
