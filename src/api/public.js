import { LANGUAGE_LIST } from '../locales/langList';
import { fetchData } from '../utils/sourceMaterial';
import { getProfile } from './common';

export const fetchSourceMaterial = async () => {
  const { sourceLang, apiHost } = await getProfile();

  const hasEPUB = LANGUAGE_LIST.find((lang) => lang.code === sourceLang).hasEPUB;

  if (hasEPUB) {
    const res = await fetch(`${apiHost}api/public/source-material/${sourceLang}`);
    if (res.status === 200) {
      const data = await res.json();
      return data;
    }
  }

  if (!hasEPUB) {
    const data = await fetchData(sourceLang.toUpperCase());
    if (data) return data;
  }
};
