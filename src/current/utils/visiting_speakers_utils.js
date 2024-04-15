import { promiseGetRecoil, promiseSetRecoil } from 'recoil-outside';
import { VisitingSpeakers } from '../classes/VisitingSpeakers';
import { congSpeakersRequestsStatusState, congSpeakersRequestsUpdateState } from '../states/congregation';

export const saveCongregationsSpeakersRequests = async (requests) => {
  await promiseSetRecoil(congSpeakersRequestsStatusState, requests);

  await updateNewApprovedRequests();
};

export const updateNewApprovedRequests = async () => {
  const requests = await promiseGetRecoil(congSpeakersRequestsStatusState);

  const newApprovals = [];

  for (const request of requests) {
    if (request.request_status === 'approved') {
      const cong = VisitingSpeakers.getCongregation(request.cong_number);

      if (!cong.notif_dismissed) {
        newApprovals.push(request);
      }
    }
  }

  await promiseSetRecoil(congSpeakersRequestsUpdateState, newApprovals);
};
