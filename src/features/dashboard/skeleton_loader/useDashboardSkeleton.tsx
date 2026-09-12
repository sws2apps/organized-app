import { useAtomValue } from 'jotai';
import { congAccountConnectedState, forceReloadEnabledState } from '@states/app';
import { useCurrentUser } from '@hooks/index';
import useSharedHook from '@pages/dashboard/useSharedHook';

const useDashboardSkeleton = () => {
  const {
    isAdmin,
    isAttendanceEditor,
    isElder,
    isGroup,
    isGroupOverseer,
    isLanguageGroupOverseer,
    isMeetingEditor,
    isPersonViewer,
    isPublisher,
    isSecretary,
  } = useCurrentUser();

  const { showMeetingCard } = useSharedHook();

  const isConnected = useAtomValue(congAccountConnectedState);
  const showForceReload = useAtomValue(forceReloadEnabledState);

  const showApp =
    isConnected ||
    (!isGroup && (isAdmin || isElder)) ||
    (isGroup && isLanguageGroupOverseer) ||
    showForceReload;

  const showReports =
    (showMeetingCard && isAttendanceEditor) ||
    isSecretary ||
    isGroupOverseer ||
    isLanguageGroupOverseer;

  const cards = [
    { key: 'ministry', items: 3, badges: [0], show: isPublisher },
    { key: 'meetings', items: 4, badges: [0], show: true },
    { key: 'activities', items: 1, show: true },
    { key: 'persons', items: 4, badges: [2], show: isPersonViewer },
    { key: 'meeting_materials', items: 3, badges: [0], show: isMeetingEditor },
    { key: 'reports', items: 3, badges: [2], show: showReports },
    { key: 'congregation', items: 2, show: isPublisher || isElder },
    { key: 'app', items: 4, show: showApp },
  ];

  return { cards: cards.filter((card) => card.show) };
};

export default useDashboardSkeleton;
