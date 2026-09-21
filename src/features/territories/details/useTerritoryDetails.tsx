import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAtom } from 'jotai';
import { IconCheckCircle } from '@icons/index';
import { displaySnackNotification } from '@services/states/app';
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

  const [territories, setTerritories] = useAtom(territoriesState);

  const isNew = id === 'new';

  const stored = territories.find((item) => item.id === id);

  const [draft, setDraft] = useState(blankTerritory());
  const [deleteOpen, setDeleteOpen] = useState(false);

  const territory = isNew ? draft : stored;

  const takenNumbers = territories
    .filter((item) => item.id !== territory?.id)
    .map((item) => item.number);

  const isDuplicate =
    !!territory?.number.trim() &&
    takenNumbers.includes(territory.number.trim());

  const canSave = !!territory?.number.trim() && !isDuplicate;

  const handleChange = (next: Territory) => {
    if (isNew) {
      setDraft(next);
      return;
    }

    setTerritories((prev) =>
      prev.map((item) => (item.id === next.id ? next : item))
    );
  };

  const handleSave = () => {
    if (!canSave) return;

    setTerritories((prev) => [draft, ...prev]);

    displaySnackNotification({
      header: 'Territory added',
      message: `Territory ${draft.number} was added.`,
      severity: 'success',
      icon: <IconCheckCircle color="var(--white)" />,
    });

    navigate(`/territories/${draft.id}`, { replace: true });
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
    isDuplicate,
    handleChange,
    canSave,
    handleSave,
    handleDelete,
    deleteOpen,
    setDeleteOpen,
  };
};

export default useTerritoryDetails;
