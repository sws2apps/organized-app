import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAtom } from 'jotai';
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
} from '../helpers';
import {
  Territory,
  TerritoryFilters,
  TerritoryStatus,
  TerritoryTab,
} from '@definition/territory';

const TAB_IDS: TerritoryTab[] = [
  'recommended',
  'all',
  'mine',
  'overdue',
  'requests',
];

const TAB_LABELS: Record<TerritoryTab, string> = {
  requests: 'Requests',
  recommended: 'Recommended',
  all: 'All',
  mine: 'Mine',
  overdue: 'Overdue',
};

const useTerritoriesHub = () => {
  const navigate = useNavigate();

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

  const tabFromUrl = TAB_IDS.indexOf(searchParams.get('tab') as TerritoryTab);
  const tab = tabFromUrl === -1 ? 0 : tabFromUrl;

  const setTab = (next: number) => {
    searchParams.set('tab', TAB_IDS[next]);
    setSearchParams(searchParams, { replace: true });
  };

  const requests = forTab(withStatus, 'requests').length;

  const tabs = TAB_IDS.map((id) => ({
    label: TAB_LABELS[id],
    ...(id === 'requests' && requests > 0 ? { badge: requests } : {}),
  }));

  const visible = useMemo(
    () => applyFilters(forTab(withStatus, TAB_IDS[tab]), filters),
    [withStatus, tab, filters]
  );

  const boardTerritories = useMemo(
    () => applyFilters(withStatus, filters),
    [withStatus, filters]
  );

  const selected = territories.filter((territory) => checked.has(territory.id));

  const patch = (id: string, changes: Partial<Territory>) =>
    setTerritories((prev) =>
      prev.map((territory) =>
        territory.id === id ? { ...territory, ...changes } : territory
      )
    );

  const handleAssign = (id: string, publisher: string, assignedOn?: Date) => {
    const days = assignedOn
      ? Math.max(0, Math.round((Date.now() - assignedOn.getTime()) / 86400000))
      : 0;

    patch(id, {
      status: 'in_work',
      holder: publisher,
      daysOut: days,
      requestedBy: undefined,
      reviewNeeded: false,
    });
  };

  const handleDecline = (id: string) => patch(id, { requestedBy: undefined });

  const handleReturn = (id: string, households?: number, returnedOn?: Date) => {
    const days = returnedOn
      ? Math.max(0, Math.round((Date.now() - returnedOn.getTime()) / 86400000))
      : 0;

    patch(id, {
      status: 'available',
      holder: undefined,
      daysOut: undefined,
      daysSinceCovered: days,
      reviewNeeded: households === undefined,
      ...(households === undefined ? {} : { households }),
    });
  };

  const handleDrop = (id: string, status: TerritoryStatus) => {
    if (status === 'in_work') {
      setAssignId(id);
      return;
    }

    if (status === 'available') {
      handleReturn(id);
      setReturnId(id);
      return;
    }
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
    tabId: TAB_IDS[tab],
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
