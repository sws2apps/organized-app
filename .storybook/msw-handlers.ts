import { http, HttpResponse } from 'msw';

export const mswHandlers = {
  // Add backend mock endpoints here as needed for story testing
  // e.g. for '/api/congregations', '/api/countries'
  lookups: [
    http.get('/api/countries', () =>
      HttpResponse.json([{ code: 'US', name: 'United States' }, { code: 'GB', name: 'United Kingdom' }])
    ),
    http.get('/api/congregations', () =>
      HttpResponse.json([{ id: '1', name: 'Test Congregation', country: 'US' }])
    ),
  ],
};
