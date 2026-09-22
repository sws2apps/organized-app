import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAtom } from 'jotai';
import { useCurrentUser } from '@hooks/index';
import {
  territoriesShowHouseholdsState,
  territoriesState,
  territoryOverdueMonthsState,
} from '@states/territories';
import {
  applyFilters,
  EMPTY_FILTERS,
  forTab,
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
  ['mine', 'requested'],
  ['requests'],
];

const TAB_LABELS: Record<TerritoryTab, string> = {
  recommended: 'Recommended',
  all: 'All territories',
  mine: 'Assigned',
  requested: 'Requested',
  requests: 'Requests',
};

const useTerritoriesHub = () => {
  const navigate = useNavigate();

  const { isElder, isServiceCommittee } = useCurrentUser();

  const isTerritoryEditor = isElder || isServiceCommittee;

  const [searchParams, setSearchParams] = useSearchParams();

  const [territories, setTerritories] = useAtom(territoriesState);
  const [showHouseholds, setShowHouseholds] = useAtom(
    territoriesShowHouseholdsState
  );
  const [overdueMonths, setOverdueMonths] = useAtom(
    territoryOverdueMonthsState
  );

  const [filters, setFilters] = useState<TerritoryFilters>(EMPTY_FILTERS);

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
  const [filtersOpen, setFiltersOpen] = useState(false);

  const fromUrl = searchParams.get('tab') as TerritoryTab;

  const requested =
    fromUrl === 'requests' && !isTerritoryEditor ? 'requested' : fromUrl;

  const group =
    TAB_GROUPS.find((item) => item.includes(requested)) ?? TAB_GROUPS[0];
  const tabId = group.includes(requested) ? requested : group[0];

  const isBrowsing = group === TAB_GROUPS[0];
  const tab = group.indexOf(tabId);

  useEffect(() => {
    setChecked(new Set());
  }, [tabId]);

  const setTab = (next: number) => {
    searchParams.set('tab', group[next]);
    setSearchParams(searchParams, { replace: true });
  };

  const ownRequests = forTab(withStatus, 'requested').length;

  const tabs =
    group.length > 1
      ? group.map((id) => ({
          label: TAB_LABELS[id],
          ...(id === 'requested' && ownRequests > 0
            ? { badge: ownRequests }
            : {}),
        }))
      : [];

  const visible = useMemo(
    () => applyFilters(forTab(withStatus, tabId), filters),
    [withStatus, tabId, filters]
  );

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

  const handleOpen = (id: string) => navigate(`/territories/${id}`);

  return {
    tab,
    tabId,
    isBrowsing,
    isTerritoryEditor,
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
