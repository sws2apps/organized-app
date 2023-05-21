import { LANGUAGE_LIST } from '../locales/langList';
import { fetchData } from '../utils/sourceMaterial';
import { getProfile } from './common';

export const fetchSourceMaterial = async (downloadIssue) => {
  const { sourceLang, apiHost } = await getProfile();

  const hasEPUB = LANGUAGE_LIST.find((lang) => lang.code === sourceLang).hasEPUB;

  if (hasEPUB) {
    const res = await fetch(`${apiHost}api/public/source-material/${sourceLang}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        appclient: 'cpe',
        appversion: import.meta.env.PACKAGE_VERSION,
        issuedate: downloadIssue,
      },
    });
    if (res.status === 200) {
      const data = await res.json();
      return data;
    }
  }

  if (!hasEPUB) {
    const data = await fetchData(sourceLang.toUpperCase(), downloadIssue);
    if (data) return data;
  }
};
