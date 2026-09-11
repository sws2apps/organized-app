import { apiDefault } from './common';

export const apiFetchSources = async (sourceLanguage?: string) => {
  const { isOnline, JWLang } = await apiDefault();

  if (!isOnline) {
    return { status: 0, data: [] };
  }

  const url =
    import.meta.env.VITE_SOURCE_MATERIALS_API ||
    'https://source-materials.organized-app.com';

  const language = (sourceLanguage || JWLang).toUpperCase();

  const res = await fetch(`${url}/api/${language}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await res.json();

  return { status: res.status, data };
};
