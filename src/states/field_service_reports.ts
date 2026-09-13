/*
This file holds the source of the truth from the table "fieldServiceReports".
*/

import { atom } from 'jotai';
import {
  CongFieldServiceReportType,
  PersonFilterOption,
} from '@definition/cong_field_service_reports';
import { congFieldServiceReportSchema } from '@services/dexie/schema';

export const fieldServiceReportsState = atom<CongFieldServiceReportType[]>([]);

export const congFieldServiceReportsState = atom((get) => {
  const reports = get(fieldServiceReportsState);

  const results = reports.filter(
    (record) => record.report_data._deleted === false
  );

  return results;
});

export const selectedMonthFieldServiceReportState = atom<string>();

export const personFilterFieldServiceReportState =
  atom<PersonFilterOption>('active');

export const selectedPublisherReportState = atom<string>();

export const personSearchFieldServiceReportState = atom<string>('');

export const publisherCurrentReportState = atom(
  structuredClone(congFieldServiceReportSchema)
);

/**
 * The months each person shared in the ministry, keyed by person_uid.
 *
 * A report saying the person did not share in the ministry is left out, since
 * that month does not count towards regularity.
 */
export const reportsMapState = atom((get) => {
  const reports = get(congFieldServiceReportsState);

  const map = new Map<string, Set<string>>();

  for (const r of reports) {
    if (!r.report_data.shared_ministry) continue;

    const uid = r.report_data.person_uid;
    const month = r.report_data.report_date;

    let months = map.get(uid);

    if (!months) {
      months = new Set();
      map.set(uid, months);
    }

    months.add(month);
  }

  return map;
});
