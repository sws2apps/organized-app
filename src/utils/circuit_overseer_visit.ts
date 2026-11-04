import { FullnameOption, SettingsType } from '@definition/settings';
import { buildPersonFullname, generateDisplayName } from '@utils/common';
import { addDays, dateFormatFriendly, formatDate } from '@utils/date';

// A substitute replaces the regular circuit overseer for that visit week only.
export const circuitOverseerNamesGet = (
  settings: SettingsType,
  weekOf: string,
  fullnameOption?: FullnameOption
) => {
  const co = settings.cong_settings.circuit_overseer;

  const substitute = co.visits.find(
    (record) => !record._deleted && record.weekOf === weekOf
  )?.substitute;

  if (substitute?.enabled) {
    return {
      fullname: buildPersonFullname(
        substitute.lastname,
        substitute.firstname,
        fullnameOption
      ),
      displayName: generateDisplayName(
        substitute.lastname,
        substitute.firstname
      ),
      wifeFullname: buildPersonFullname(
        substitute.wife_lastname,
        substitute.wife_firstname,
        fullnameOption
      ),
    };
  }

  return {
    fullname: buildPersonFullname(
      co.lastname.value,
      co.firstname.value,
      fullnameOption
    ),
    displayName: co.display_name.value,
    wifeFullname: buildPersonFullname(
      co.wife_lastname?.value ?? '',
      co.wife_firstname?.value ?? '',
      fullnameOption
    ),
  };
};

export const circuitOverseerVisitDate = (weekOf: string, day: number) =>
  addDays(weekOf, day);

export const circuitOverseerVisitLabel = (weekOf: string) => {
  const end = formatDate(circuitOverseerVisitDate(weekOf, 6), 'yyyy/MM/dd');

  return `${dateFormatFriendly(weekOf)} – ${dateFormatFriendly(end)}`;
};
