import { loadEPUB } from 'jw-epub-parser';
import { getProfile } from '../api/common';

const fetchIssueData = (issue) => {
  return new Promise((resolve) => {
    if (!issue.hasEPUB) {
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
            for (let z = 0; z < raws.length; z++) {
              const rawText = raws[z];
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
    }
  });
};

export const fetchData = async (language) => {
  const { apiHost } = await getProfile();

  const mergedSources = [];
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

  const issues = [];

  do {
    const issueDate = currentYear + String(monthMwb).padStart(2, '0');
    const url = `${apiHost}api/public/source-material/${language}/${issueDate}`;

    const res = await fetch(url);

    if (res.status === 200) {
      const result = await res.json();
      const hasEPUB = result.files[language].EPUB;

      issues.push({ apiHost, issueDate, currentYear, language, hasEPUB: hasEPUB });
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

  if (issues.length > 0) {
    const fetchSource1 = fetchIssueData(issues[0]);
    const fetchSource2 = issues.length > 1 ? fetchIssueData(issues[1]) : Promise.resolve({});
    const fetchSource3 = issues.length > 2 ? fetchIssueData(issues[2]) : Promise.resolve({});
    const fetchSource4 = issues.length > 3 ? fetchIssueData(issues[3]) : Promise.resolve({});

    const allData = await Promise.all([fetchSource1, fetchSource2, fetchSource3, fetchSource4]);

    for (let z = 0; z < allData.length; z++) {
      const tempObj = allData[z];
      if (tempObj.issueDate) {
        mergedSources.push(tempObj);
      }
    }
  }

  return mergedSources;
};
