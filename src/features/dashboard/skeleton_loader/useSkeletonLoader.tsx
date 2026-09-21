import { useMemo } from 'react';
import useCurrentUser from '@hooks/useCurrentUser';

const useSkeletonLoader = () => {
  const {
    isMeetingEditor,
    isPublisher,
    isPersonViewer,
    isElder,
    isAttendanceEditor,
    isGroupOverseer,
    isLanguageGroupOverseer,
  } = useCurrentUser();

  // the dashboard's cards in order, with their usual number of menu rows,
  // shown under the same conditions as the real cards
  const cardRows = useMemo(() => {
    const isReportsVisible =
      isElder ||
      isAttendanceEditor ||
      isGroupOverseer ||
      isLanguageGroupOverseer;

    const cards = [
      { rows: 3, visible: isPublisher }, // ministry
      { rows: 4, visible: true }, // meetings
      { rows: 1, visible: true }, // activities
      { rows: 3, visible: isPersonViewer }, // persons
      { rows: 3, visible: isMeetingEditor }, // meeting materials
      { rows: 4, visible: isReportsVisible }, // reports
      { rows: 3, visible: true }, // congregation
    ];

    return cards.filter((card) => card.visible).map((card) => card.rows);
  }, [
    isMeetingEditor,
    isPublisher,
    isPersonViewer,
    isElder,
    isAttendanceEditor,
    isGroupOverseer,
    isLanguageGroupOverseer,
  ]);

  return { cardRows };
};

export default useSkeletonLoader;
