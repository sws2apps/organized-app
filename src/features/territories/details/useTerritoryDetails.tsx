import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useAtom } from 'jotai';
import { territoriesState } from '@states/territories';
import { Territory } from '@definition/territory';

const blankTerritory = (): Territory => ({
  id: `t-${Date.now()}`,
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

const useTerritoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [territories, setTerritories] = useAtom(territoriesState);

  const isNew = id === 'new';

  const stored = territories.find((item) => item.id === id);

  const [draft, setDraft] = useState(() => blankTerritory());
  const [deleteOpen, setDeleteOpen] = useState(false);

  const territory = isNew ? draft : stored;

  const handleChange = (next: Territory) => {
    if (!isNew) {
      setTerritories((prev) =>
        prev.map((item) => (item.id === next.id ? next : item))
      );
      return;
    }

    const number = next.number.trim();
    const isTaken = territories.some((item) => item.number.trim() === number);

    if (!number || isTaken) {
      setDraft(next);
      return;
    }

    // saved as soon as it has a usable number, like every later change;
    // it keeps the page it was added from as its parent
    setTerritories((prev) => [next, ...prev]);
    navigate(`/territories/${next.id}`, {
      replace: true,
      state: location.state,
    });
  };

  const handleDelete = () => {
    if (!territory) return;

    setTerritories((prev) => prev.filter((item) => item.id !== territory.id));
    setDeleteOpen(false);
    navigate('/territories');
  };

  return {
    territory,
    isNew,
    handleChange,
    handleDelete,
    deleteOpen,
    setDeleteOpen,
  };
};

export default useTerritoryDetails;
