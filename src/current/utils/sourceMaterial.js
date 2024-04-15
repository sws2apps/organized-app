import { loadEPUB } from 'jw-epub-parser';
import { getI18n } from 'react-i18next';
import { getProfile } from '../api/common';
import { Setting } from '../classes/Setting';
import { Sources } from '../classes/Sources';

const fetchIssueData = (issue) => {
  return new Promise((resolve) => {
    const language = issue.language;

    const url = `${issue.apiHost}api/public/source-material/${language}/${issue.issueDate}/docs-id`;

    fetch(url).then((res) =>
      res.json().then((docIds) => {
        const htmlRaws = [];

        const fetchSchedule1 = fetch(
          `${issue.apiHost}api/public/source-material/${language}/${docIds[0]}/content`
        ).then((res) => res.json());
        const fetchSchedule2 = fetch(
          `${issue.apiHost}api/public/source-material/${language}/${docIds[1]}/content`
        ).then((res) => res.json());
        const fetchSchedule3 = fetch(
          `${issue.apiHost}api/public/source-material/${language}/${docIds[2]}/content`
        ).then((res) => res.json());
        const fetchSchedule4 = fetch(
          `${issue.apiHost}api/public/source-material/${language}/${docIds[3]}/content`
        ).then((res) => res.json());
        const fetchSchedule5 = fetch(
          `${issue.apiHost}api/public/source-material/${language}/${docIds[4]}/content`
        ).then((res) => res.json());
        const fetchSchedule6 = fetch(
          `${issue.apiHost}api/public/source-material/${language}/${docIds[5]}/content`
        ).then((res) => res.json());
        const fetchSchedule7 = fetch(
          `${issue.apiHost}api/public/source-material/${language}/${docIds[6]}/content`
        ).then((res) => res.json());
        const fetchSchedule8 = docIds[7]
          ? fetch(`${issue.apiHost}api/public/source-material/${language}/${docIds[7]}/content`).then((res) =>
              res.json()
            )
          : Promise.resolve('');
        const fetchSchedule9 = docIds[8]
          ? fetch(`${issue.apiHost}api/public/source-material/${language}/${docIds[8]}/content`).then((res) =>
              res.json()
            )
          : Promise.resolve('');
        const fetchSchedule10 = docIds[9]
          ? fetch(`${issue.apiHost}api/public/source-material/${language}/${docIds[9]}/content`).then((res) =>
              res.json()
            )
          : Promise.resolve('');

        const allData = Promise.all([
          fetchSchedule1,
          fetchSchedule2,
          fetchSchedule3,
          fetchSchedule4,
          fetchSchedule5,
          fetchSchedule6,
          fetchSchedule7,
          fetchSchedule8,
          fetchSchedule9,
          fetchSchedule10,
        ]);

        allData.then((raws) => {
          for (const rawText of raws) {
            if (rawText !== '') {
              htmlRaws.push(rawText);
            }
          }

          loadEPUB({ htmlRaws, mwbYear: issue.currentYear, lang: language }).then((epubData) => {
            const obj = {
              issueDate: issue.issueDate,
              ...epubData,
            };

            resolve(obj);
          });
        });
      })
    );
  });
};

export const fetchData = async (language, issue) => {
  const { apiHost } = await getProfile();

  const mergedSources = [];

  const issues = [];

  if (issue === '') {
    let notFound = false;

    // get current issue
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const weekDate = new Date(today.setDate(diff));
    const currentMonth = weekDate.getMonth() + 1;
    const monthOdd = currentMonth % 2 === 0 ? false : true;
    let monthMwb = monthOdd ? currentMonth : currentMonth - 1;
    let currentYear = weekDate.getFullYear();

    do {
      const issueDate = currentYear + String(monthMwb).padStart(2, '0');
      const url = `${apiHost}api/public/source-material/${language}/${issueDate}`;

      const res = await fetch(url);

      if (res.status === 200) {
        issues.push({ apiHost, issueDate, currentYear, language });
      }

      if (res.status === 404) {
        notFound = true;
      }

      // assigning next issue
      monthMwb = monthMwb + 2;
      if (monthMwb === 13) {
        monthMwb = 1;
        currentYear++;
      }
    } while (notFound === false);
  }

  if (issue !== '') {
    const url = `${apiHost}api/public/source-material/${language}/${issue}`;

    const res = await fetch(url);

    if (res.status === 200) {
      const currentYear = issue.substring(0, 4);
      issues.push({ apiHost, issueDate: issue, currentYear, language });
    }
  }

  if (issues.length > 0) {
    let fetchSource1 = fetchIssueData(issues[0]);
    let fetchSource2 = issues.length > 1 ? fetchIssueData(issues[1]) : Promise.resolve({});
    let fetchSource3 = issues.length > 2 ? fetchIssueData(issues[2]) : Promise.resolve({});
    let fetchSource4 = issues.length > 3 ? fetchIssueData(issues[3]) : Promise.resolve({});
    let fetchSource5 = issues.length > 4 ? fetchIssueData(issues[4]) : Promise.resolve({});
    let fetchSource6 = issues.length > 5 ? fetchIssueData(issues[5]) : Promise.resolve({});

    const allData = await Promise.all([
      fetchSource1,
      fetchSource2,
      fetchSource3,
      fetchSource4,
      fetchSource5,
      fetchSource6,
    ]);

    fetchSource1 = null;
    fetchSource2 = null;
    fetchSource3 = null;
    fetchSource4 = null;
    fetchSource5 = null;
    fetchSource6 = null;

    for (const tempObj of allData) {
      if (tempObj.issueDate) {
        mergedSources.push(tempObj);
      }
    }
  }

  return mergedSources;
};

export const checkAYFExplainingBeliefsAssignment = (source) => {
  const { t } = getI18n();

  const boundary = '(?:^|\\s|$)';
  const talk = t('talk', { lng: Setting.source_lang, ns: 'source' });
  const demonstration = t('demonstration', { lng: Setting.source_lang, ns: 'source' });
  const searchKey = `${boundary}${talk}|${boundary}${demonstration}`;
  const regex = new RegExp(searchKey, 'i');
  const result = source.match(regex);

  const isTalk = result[0].toLowerCase() === talk.toLowerCase();

  return isTalk;
};

export const checkLCAssignments = (source) => {
  const { t } = getI18n();

  const search = `(${t('lcNoAssignedVariations', { lng: Setting.source_lang, ns: 'source' })})`;
  const regex = new RegExp(search.toLowerCase());
  const array = regex.exec(source.toLowerCase());

  return Array.isArray(array);
};

export const checkLCElderAssignments = (source, content) => {
  let isElderPart = false;

  const { t } = getI18n();

  const search = `(${t('lcSourceElderVariations', { lng: Setting.source_lang, ns: 'source' })})`;
  const regex = new RegExp(search.toLowerCase());
  const array = regex.exec(source.toLowerCase());
  isElderPart = Array.isArray(array);

  if (!isElderPart) {
    const search = `(${t('lcContentElderVariations', { lng: Setting.source_lang, ns: 'source' })})`;
    const regex = new RegExp(search.toLowerCase());
    const array = regex.exec(content.toLowerCase());
    isElderPart = Array.isArray(array);
  }

  return isElderPart;
};

export const checkCBSReader = (source) => {
  const sourceLang = Setting.source_lang;

  const { t } = getI18n();

  let search = t('cbsLffWithPointsVariations', { lng: sourceLang, ns: 'source' });
  search = search.replaceAll('{{ lesson }}', '\\d+');
  search = search.replaceAll('{{ points }}', '(\\d+-\\d+|\\d+)');

  let regex = new RegExp(search.toLowerCase());
  let array = regex.exec(source.toLowerCase());

  if (Array.isArray(array)) {
    let lffPoint = array[1] || array[2];
    lffPoint = +lffPoint.charAt(0);

    return lffPoint !== 1;
  }

  if (!Array.isArray(array)) {
    search = t('cbsLffSectionOnlyVariations', { lng: sourceLang, ns: 'source' });
    regex = new RegExp(search);
    array = regex.exec(source);

    return Array.isArray(array);
  }

  return false;
};

export const fetchScheduleInfo = (condition, currentSchedule, currentWeek) => {
  const newData = [];

  if (condition) {
    const allWeeks = Sources.weekListBySchedule(currentSchedule.value);
    for (const week of allWeeks) {
      const obj = {};
      obj.value = week;
      newData.push(obj);
    }
  } else {
    newData.push({ value: currentWeek.value });
  }

  let cnTotal = 0;
  let cnAssigned = 0;
  for (const item of newData) {
    const week = item.value;
    const { total, assigned } = Sources.get(week).countAssignmentsInfo();

    cnTotal += total;
    cnAssigned += assigned;
  }

  return { weeks: newData, total: cnTotal, assigned: cnAssigned };
};

export const getWeekDate = (weekOf) => {
  const month = +weekOf.split('/')[1] - 1;
  const day = +weekOf.split('/')[2];
  const year = +weekOf.split('/')[0];

  return new Date(year, month, day);
};

export const getOldestWeekDate = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const weekDate = new Date(today.setDate(diff));
  const validDate = weekDate.setMonth(weekDate.getMonth() - 12);
  return new Date(validDate);
};
