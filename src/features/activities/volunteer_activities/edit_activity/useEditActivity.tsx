import { ChangeEvent, useState } from 'react';
import { useAtomValue } from 'jotai';
import { hour24FormatState } from '@states/settings';
import { stackDatesToOne } from '@utils/date';
import { EditActivityProps } from './index.types';

const useEditActivity = ({
  data,
  participantsCount,
  onSave,
}: EditActivityProps) => {
  const hour24 = useAtomValue(hour24FormatState);

  const [localActivity, setLocalActivity] = useState(data);
  const [goal, setGoal] = useState(String(data.activity_data.participant_goal));
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [errors, setErrors] = useState({ name: false, goal: '' });

  const start = new Date(localActivity.activity_data.start);

  const updateData = (values: Partial<typeof data.activity_data>) => {
    setLocalActivity((prev) => ({
      ...prev,
      activity_data: { ...prev.activity_data, ...values },
    }));
  };

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    updateData({ name: e.target.value });
  };

  const handleChangeDescription = (e: ChangeEvent<HTMLInputElement>) => {
    updateData({ description: e.target.value });
  };

  const handleChangeDate = (value: Date | null) => {
    if (!value) return;

    updateData({ start: stackDatesToOne(value, start, true).toISOString() });
  };

  const handleChangeTime = (value: Date | null) => {
    if (!value) return;

    updateData({ start: stackDatesToOne(start, value, true).toISOString() });
  };

  const handleChangeGoal = (e: ChangeEvent<HTMLInputElement>) => {
    setGoal(e.target.value);
  };

  const handleToggleAllowExtra = (value: boolean) => {
    updateData({ allow_extra: value });
  };

  const handleSave = () => {
    const participantGoal = Number(goal);

    let goalError = '';

    if (!Number.isInteger(participantGoal) || participantGoal < 1) {
      goalError = 'tr_fillRequiredField';
    } else if (
      !localActivity.activity_data.allow_extra &&
      participantGoal < participantsCount
    ) {
      goalError = 'tr_participantGoalTooLow';
    }

    const newErrors = {
      name: localActivity.activity_data.name.trim().length === 0,
      goal: goalError,
    };

    setErrors(newErrors);

    if (newErrors.name || newErrors.goal) return;

    onSave({
      ...localActivity,
      activity_data: {
        ...localActivity.activity_data,
        name: localActivity.activity_data.name.trim(),
        description: localActivity.activity_data.description.trim(),
        participant_goal: participantGoal,
        updatedAt: new Date().toISOString(),
      },
    });
  };

  const handleDelete = () => {
    onSave({
      ...data,
      activity_data: {
        ...data.activity_data,
        _deleted: true,
        updatedAt: new Date().toISOString(),
      },
    });
  };

  return {
    hour24,
    localActivity,
    start,
    goal,
    errors,
    deleteOpen,
    handleOpenDelete: () => setDeleteOpen(true),
    handleCloseDelete: () => setDeleteOpen(false),
    handleChangeName,
    handleChangeDescription,
    handleChangeDate,
    handleChangeTime,
    handleChangeGoal,
    handleToggleAllowExtra,
    handleSave,
    handleDelete,
  };
};

export default useEditActivity;
