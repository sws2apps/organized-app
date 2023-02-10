import { loadEPUB } from 'jw-epub-parser';

export const getSchedules = async () => {
  const JW_CDN = 'https://app.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?';
  const JW_FINDER = 'https://www.jw.org/finder?';

  const fetchIssueData = (issue) => {
    return new Promise((resolve) => {
      if (!issue.hasEPUB) {
        const language = issue.language;

        const url =
          JW_FINDER +
          new URLSearchParams({
            wtlocale: language,
            pub: 'mwb',
            issue: issue.issueDate,
          });

        fetch(url).then((res) =>
          res.text().then((result) => {
            const parser = new window.DOMParser();
            const htmlItem = parser.parseFromString(result, 'text/html');

            const docIds = [];
            const accordionItems = htmlItem.getElementsByClassName('docClass-106');
            for (const weekLink of accordionItems) {
              weekLink.classList.forEach((item) => {
                if (item.indexOf('docId-') !== -1) {
                  docIds.push(item.split('-')[1]);
                }
              });
            }

            const htmlRaws = [];

            const fetchSchedule1 = fetch(`https://www.jw.org/finder?wtlocale=${language}&docid=${docIds[0]}`).then(
              (res) => res.text()
            );
            const fetchSchedule2 = fetch(`https://www.jw.org/finder?wtlocale=${language}&docid=${docIds[1]}`).then(
              (res) => res.text()
            );
            const fetchSchedule3 = fetch(`https://www.jw.org/finder?wtlocale=${language}&docid=${docIds[2]}`).then(
              (res) => res.text()
            );
            const fetchSchedule4 = fetch(`https://www.jw.org/finder?wtlocale=${language}&docid=${docIds[3]}`).then(
              (res) => res.text()
            );
            const fetchSchedule5 = fetch(`https://www.jw.org/finder?wtlocale=${language}&docid=${docIds[4]}`).then(
              (res) => res.text()
            );
            const fetchSchedule6 = fetch(`https://www.jw.org/finder?wtlocale=${language}&docid=${docIds[5]}`).then(
              (res) => res.text()
            );
            const fetchSchedule7 = fetch(`https://www.jw.org/finder?wtlocale=${language}&docid=${docIds[6]}`).then(
              (res) => res.text()
            );
            const fetchSchedule8 = docIds[7]
              ? fetch(`https://www.jw.org/finder?wtlocale=${language}&docid=${docIds[7]}`).then((res) => res.text())
              : Promise.resolve('');
            const fetchSchedule9 = docIds[8]
              ? fetch(`https://www.jw.org/finder?wtlocale=${language}&docid=${docIds[8]}`).then((res) => res.text())
              : Promise.resolve('');
            const fetchSchedule10 = docIds[9]
              ? fetch(`https://www.jw.org/finder?wtlocale=${language}&docid=${docIds[9]}`).then((res) => res.text())
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

  const fetchData = async (language) => {
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
      const url =
        JW_CDN +
        new URLSearchParams({
          langwritten: language,
          pub: 'mwb',
          output: 'json',
          issue: issueDate,
        });

      const res = await fetch(url);

      if (res.status === 200) {
        const result = await res.json();
        const hasEPUB = result.files[language].EPUB;

        issues.push({ issueDate, currentYear, language, hasEPUB: hasEPUB });
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

  const data = await fetchData('T');
  console.log(data);
};
