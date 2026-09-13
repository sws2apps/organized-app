import { apiFetchSources } from '@services/api/sources';
import { sourcesImportJW } from './sources';

export const syncJWMeetingMaterials = async (sourceLanguage?: string) => {
  const { data, status } = await apiFetchSources(sourceLanguage);

  if (status !== 200 || !Array.isArray(data) || data.length === 0) {
    return false;
  }

  await sourcesImportJW(data, sourceLanguage);

  return true;
};
