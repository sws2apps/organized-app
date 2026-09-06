import { http, HttpResponse } from 'msw';
import { CongregationResponseType, CountryResponseType } from '@definition/api';

/**
 * Default request handlers for stories. The paths mirror the real
 * sws2apps-api routes used by `@services/api` (`apiHost` is empty in
 * Storybook, so requests resolve against the Storybook origin).
 *
 * Override or extend them per story with `parameters.msw.handlers`.
 */
const countries: CountryResponseType[] = [
  { countryCode: 'US', countryName: 'United States', countryGuid: 'us' },
  { countryCode: 'GB', countryName: 'United Kingdom', countryGuid: 'gb' },
  { countryCode: 'DE', countryName: 'Germany', countryGuid: 'de' },
];

const congregations: CongregationResponseType[] = [
  {
    congGuid: 'cong-springfield-east',
    congName: 'Springfield East',
    language: 'E',
    address: '12 Main Street, Springfield',
    circuit: 'US-12',
    location: { lat: 39.78, lng: -89.65 },
    midweekMeetingTime: { weekday: 3, time: '19:00' },
    weekendMeetingTime: { weekday: 7, time: '10:00' },
  },
  {
    congGuid: 'cong-springfield-west',
    congName: 'Springfield West',
    language: 'E',
    address: '48 Elm Avenue, Springfield',
    circuit: 'US-12',
    location: { lat: 39.8, lng: -89.7 },
    midweekMeetingTime: { weekday: 4, time: '19:30' },
    weekendMeetingTime: { weekday: 7, time: '13:00' },
  },
];

export const handlers = [
  http.get('*/api/v3/public/feature-flags', () => HttpResponse.json({})),
  http.get('*/api/v3/congregations/countries', () =>
    HttpResponse.json(countries)
  ),
  http.get('*/api/v3/congregations/search', ({ request }) => {
    const name = new URL(request.url).searchParams.get('name') ?? '';

    return HttpResponse.json(
      congregations.filter((cong) =>
        cong.congName.toLowerCase().includes(name.toLowerCase())
      )
    );
  }),
];
