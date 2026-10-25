import useTerritoryAccess from '@features/territories/useTerritoryAccess';
import { publisherTerritoryChanges } from '@services/app/territory_access';
import { territoryNumberKey } from '@utils/territory';
import { useAppTranslation } from '@hooks/index';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useBlocker, useNavigate, useParams } from 'react-router';
import { useAtom, useAtomValue } from 'jotai';
import {
  territoriesState,
  territoriesWithStatusState,
} from '@states/territories';
import { Territory } from '@definition/territory';
import { offerUndo } from '@features/territories/undo';
import { restoreTerritory } from '@features/territories/restore';

export const blankTerritory = (): Territory => ({
  id: crypto.randomUUID(),
  number: '',
  name: '',
  city: '',
  type: 'door_to_door',
  status: 'available',
  categories: [],
  cardLost: false,
  daysSinceCovered: 0,
  households: 0,
  doNotCalls: [],
  assignments: [],
});

export const usableNumber = (draft: Territory, territories: Territory[]) => {
  const number = draft.number.trim();

  return (
    !!number &&
    !territories.some(
      (item) => territoryNumberKey(item.number) === territoryNumberKey(number)
    )
  );
};

const useTerritoryDetails = () => {
  const { t } = useAppTranslation();
  const context = useTerritoryAccess();

  const { id } = useParams();
  const navigate = useNavigate();

  const [territories, setTerritories] = useAtom(territoriesState);

  const withStatus = useAtomValue(territoriesWithStatusState);

  const isNewPage = id === 'new';

  const [draft, setDraft] = useState(() => blankTerritory());
  const [blank] = useState(draft);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // once saved, a new territory stays on this page, so nothing remounts under the typing
  const stored = territories.find(
    (item) => item.id === (isNewPage ? draft.id : id)
  );

  const isNew = isNewPage && !stored;

  const territory = isNew
    ? draft
    : withStatus.find((item) => item.id === stored?.id);

  const handleChange = (next: Territory) => {
    if (isNew && context.editor) {
      setDraft(next);
      return;
    }

    setTerritories((prev) =>
      prev.map((item) => {
        if (item.id !== next.id) return item;
        return context.editor
          ? next
          : { ...item, ...publisherTerritoryChanges(item, next, context) };
      })
    );
  };

  const latest = useRef({ isNew, draft, territories, editor: context.editor });
  latest.current = { isNew, draft, territories, editor: context.editor };

  // saved when its number is typed in full and usable; every later change saves at once
  const commitNew = useCallback(() => {
    const { isNew: pending, draft: next, territories: list } = latest.current;
    if (!latest.current.editor || !pending || !usableNumber(next, list)) return;

    setTerritories((prev) => [next, ...prev]);
  }, [setTerritories]);

  // a draft that can't be saved would be lost on leaving
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    const { isNew: pending, draft: next, territories: list } = latest.current;

    return (
      pending &&
      JSON.stringify(next) !== JSON.stringify(blank) &&
      !usableNumber(next, list) &&
      currentLocation.pathname !== nextLocation.pathname
    );
  });

  // leaving the page counts as done typing
  useEffect(() => commitNew, [commitNew]);

  // once saved, the address names it, so a reload opens it; the router isn't told, or the
  // page would remount under the typing
  const savedId = isNewPage ? stored?.id : undefined;
  useEffect(() => {
    if (!savedId) return;
    const url = window.location.href.replace(
      /territories\/new(?=[/?#]|$)/,
      `territories/${encodeURIComponent(savedId)}`
    );
    if (url !== window.location.href) {
      window.history.replaceState(window.history.state, '', url);
    }
  }, [savedId]);

  const handleDelete = () => {
    if (!territory || !context.editor) return;

    if (stored) {
      const index = territories.indexOf(stored);
      setTerritories((prev) => prev.filter((item) => item.id !== stored.id));
      offerUndo({
        text: t('tr_territoryTerritoryDeleted', { number: stored.number }),
        revert: () => restoreTerritory(stored, index),
      });
    }
    setDeleteOpen(false);
    navigate('/territories');
  };

  return {
    territory,
    isNew,
    isNewPage,
    handleChange,
    commitNew,
    handleDelete,
    deleteOpen,
    setDeleteOpen,
    blocker,
  };
};

export default useTerritoryDetails;
