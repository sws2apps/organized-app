import Papa from 'papaparse';
import { MAX_NOTE_LENGTH } from '@definition/territory';
import {
  MAX_TERRITORY_IMPORT_ROWS,
  MAX_TERRITORY_IMPORT_CAMPAIGN_NAME,
  type TerritoryImportDateOrder,
} from '@definition/territory_import';
import {
  emptyTerritoryImport,
  importAssignment,
  importBoundary,
  importError,
  importNotice,
} from '@utils/territory_import';

export const TERRITORY_CSV_TEMPLATE =
  '\uFEFFNumber,Name,City,Type,Households,Notes,Boundary\r\nM22,North district,Example city,InPerson,120,,\r\n';
const knownColumns = new Set([
  'territoryid',
  'categorycode',
  'category',
  'categoryname',
  'number',
  'territorynumber',
  'suffix',
  'area',
  'name',
  'city',
  'type',
  'households',
  'notes',
  'customnotes1',
  'customnotes2',
  'link1',
  'link2',
  'boundary',
  'dateassigned',
  'datecompleted',
  'publisher',
  'campaign',
  'territoryaddressid',
  'status',
  'latitude',
  'longitude',
  'apartmentnumber',
  'street',
  'suburb',
  'postalcode',
  'state',
  'phone',
  'phonenumber',
  'language',
]);
export const parseTerritoryCSV = (
  source: string,
  dateOrder: TerritoryImportDateOrder
) => {
  const headers =
    Papa.parse<string[]>(source.replace(/^\uFEFF/, ''), { preview: 1 })
      .data[0] ?? [];
  const seen = new Set<string>();
  for (const header of headers) {
    const key = header.trim().toLowerCase();
    if (!key || seen.has(key))
      return importError('tr_territoryImportDuplicateColumn', header);
    seen.add(key);
  }
  const parsed = Papa.parse<Record<string, string>>(
    source.replace(/^\uFEFF/, ''),
    {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (header) => header.trim().toLowerCase(),
    }
  );
  if (parsed.errors.some((error) => error.code !== 'UndetectableDelimiter'))
    return importError('tr_territoryImportInvalidCSV');
  if (!parsed.data.length) return importError('tr_territoryImportEmpty');
  if (parsed.data.length > MAX_TERRITORY_IMPORT_ROWS)
    return importError('tr_territoryImportTooLarge');
  const fields = parsed.meta.fields ?? [];
  const history = fields.includes('dateassigned');
  const addresses =
    fields.includes('street') ||
    fields.includes('territoryaddressid') ||
    fields.includes('phonenumber') ||
    fields.includes('phone');
  if (
    !fields.some((field) =>
      ['number', 'territorynumber', 'territoryid'].includes(field)
    )
  )
    return importError('tr_territoryImportNumberRequired');
  const data = emptyTerritoryImport();
  const unknown = fields.filter((field) => !knownColumns.has(field));
  if (unknown.length)
    importNotice(data, 'tr_territoryImportColumnsSkipped', unknown.join(', '));
  const numbers = new Set<string>();
  for (const row of parsed.data) {
    const get = (key: string) => row[key]?.trim() ?? '';
    const rawNumber =
      get('territorynumber') || (addresses ? '' : get('number'));
    const number = rawNumber
      ? `${get('categorycode')}${rawNumber}${get('suffix')}`
      : '';
    const reference = {
      number,
      sourceId: get('territoryid') ? `csv:${get('territoryid')}` : undefined,
    };
    if (history) {
      const assignment = importAssignment(
        get('publisher'),
        get('dateassigned'),
        get('datecompleted'),
        get('notes'),
        dateOrder
      );
      if (get('campaign')) {
        if (get('campaign').length > MAX_TERRITORY_IMPORT_CAMPAIGN_NAME)
          return importError('tr_territoryImportCampaignTooLong');
        // Keep imported campaign work out of ordinary coverage without creating duplicate events.
        assignment.campaign = {
          id: `import:${get('campaign')}`,
          name: get('campaign'),
          coverage: false,
        };
        importNotice(data, 'tr_territoryImportCampaignHistory');
      }
      data.assignments.push({ reference, value: assignment });
      continue;
    }
    if (addresses) {
      const address = [
        get('apartmentnumber'),
        get('number'),
        get('street'),
        get('suburb'),
        get('city'),
        get('state'),
        get('postalcode'),
      ]
        .filter(Boolean)
        .join(', ');
      const isDnc = ['dnc', 'do not call'].includes(
        get('status').toLowerCase()
      );
      const phone = get('phone') || get('phonenumber');
      if (isDnc && !address)
        return importError('tr_territoryImportInvalidAddress');
      let position: [number, number] | undefined;
      if (get('longitude') || get('latitude')) {
        const lng = Number(get('longitude'));
        const lat = Number(get('latitude'));
        if (
          !get('longitude') ||
          !get('latitude') ||
          !Number.isFinite(lng) ||
          !Number.isFinite(lat) ||
          Math.abs(lng) > 180 ||
          Math.abs(lat) > 90
        )
          return importError('tr_territoryImportInvalidAddress');
        position = [lng, lat];
      }
      if (isDnc || phone)
        data.addresses.push({
          reference,
          values: {
            doNotCalls: isDnc
              ? [
                  {
                    id: crypto.randomUUID(),
                    address,
                    date: '',
                    addedBy: '',
                    ...(get('name') ? { name: get('name') } : {}),
                    ...(position ? { position } : {}),
                  },
                ]
              : [],
            phoneNumbers: !isDnc && phone ? [phone] : [],
          },
        });
      if (!isDnc || get('notes') || get('language'))
        importNotice(data, 'tr_territoryImportAddressDetailsSkipped');
      continue;
    }
    if (!number) return importError('tr_territoryImportNumberRequired');
    if (numbers.has(number.toLocaleLowerCase()))
      return importError('tr_territoryImportDuplicate', number);
    numbers.add(number.toLocaleLowerCase());
    const values: (typeof data.entries)[number]['values'] = {};
    if (get('name') || get('area')) values.name = get('name') || get('area');
    if (get('city')) values.city = get('city');
    if (get('type')) {
      const type = get('type').toLowerCase();
      if (
        !['inperson', 'door_to_door', 'business', 'phone', 'letter'].includes(
          type
        )
      )
        return importError('tr_territoryImportInvalidType', get('type'));
      values.type =
        type === 'business'
          ? 'business'
          : type === 'phone'
            ? 'phone'
            : 'door_to_door';
      if (type === 'letter') importNotice(data, 'tr_territoryImportLetterType');
    }
    if (get('households')) {
      const count = Number(get('households'));
      if (!/^\d+$/.test(get('households')) || !Number.isSafeInteger(count))
        return importError('tr_territoryImportInvalidHouseholds', number);
      values.households = count;
    }
    const notes = [get('notes'), get('customnotes1'), get('customnotes2')]
      .filter(Boolean)
      .join('\n');
    if (notes.length > MAX_NOTE_LENGTH)
      return importError('tr_territoryImportLongNote', number);
    if (notes) values.notes = notes;
    if (get('boundary')) {
      try {
        const raw = get('boundary');
        values.boundary = importBoundary(
          JSON.parse(raw.startsWith('[[') ? raw : `[${raw}]`)
        );
      } catch {
        return importError('tr_territoryImportInvalidBoundary', number);
      }
    }
    if (get('link1') || get('link2'))
      importNotice(data, 'tr_territoryImportLinksSkipped');
    if (get('category') || get('categoryname'))
      importNotice(data, 'tr_territoryImportCategoriesSkipped');
    data.entries.push({ ...reference, values });
  }
  return data;
};
