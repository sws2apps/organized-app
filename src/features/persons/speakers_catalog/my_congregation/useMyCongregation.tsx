import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { outgoingSpeakersState } from '@states/visiting_speakers';
import SpeakersLocal from './speakers_local';
import SpeakersOutgoing from './speakers_outgoing';

const useMyCongregation = () => {
  const { t } = useAppTranslation();

  const outgoingSpeakers = useRecoilValue(outgoingSpeakersState);

  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  const tabs = useMemo(() => {
    return [
      {
        label: t('tr_speakersOutgoing'),
        Component: <SpeakersOutgoing isEditMode={isEditMode} />,
      },
      {
        label: t('tr_speakersLocal'),
        Component: <SpeakersLocal isEditMode={isEditMode} />,
      },
    ];
  }, [t, isEditMode]);

  const handleToggleExpanded = () => setIsExpanded((prev) => !prev);

  const handleToggleEdit = () => {
    setIsEditMode((prev) => {
      if (!prev) {
        setIsExpanded((prev) => {
          if (!prev) return !prev;
          return prev;
        });
      }
      return !prev;
    });
  };

  return {
    isExpanded,
    handleToggleExpanded,
    outgoingSpeakers,
    isEditMode,
    handleToggleEdit,
    tabs,
  };
};

export default useMyCongregation;
