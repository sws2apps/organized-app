import { atom, selector } from 'recoil';

export const refreshReportState = atom({
  key: 'refreshReport',
  default: true,
});

export const isAddSYOpenState = atom({
  key: 'isAddSYOpen',
  default: false,
});

export const pendingFieldServiceReportsState = atom({
  key: 'pendingFieldServiceReports',
  default: [],
});

export const pendingFieldServiceReportsCountState = selector({
  key: 'pendingFieldServiceReportsCount',
  get: ({ get }) => {
    const pendingReports = get(pendingFieldServiceReportsState);
    return pendingReports.length;
  },
});
