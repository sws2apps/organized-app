import { apiDefault } from './common';

export const apiFetchSources = async () => {
  const { isOnline, JWLang } = await apiDefault();

  if (isOnline) {
    const url =
      import.meta.env.VITE_SOURCE_MATERIALS_API ||
      'https://source-materials.organized-app.com';

    const res = await fetch(`${url}/api/${JWLang}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    return { status: res.status, data };
  }
};
