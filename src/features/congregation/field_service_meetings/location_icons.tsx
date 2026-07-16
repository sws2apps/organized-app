import { type ReactElement, cloneElement } from 'react';
import {
  IconAtHome,
  IconConference,
  IconCongregation,
  IconInTerritory,
} from '@components/icons';
import { FieldServiceMeetingLocation } from '@definition/field_service_meetings';

// Location icons shared by the meeting form and the meeting card.
export const locationIconMap: Record<
  FieldServiceMeetingLocation,
  ReactElement<{ color?: string }>
> = {
  [FieldServiceMeetingLocation.Publisher]: <IconAtHome color="var(--black)" />,
  [FieldServiceMeetingLocation.KingdomHall]: (
    <IconCongregation color="var(--black)" />
  ),
  [FieldServiceMeetingLocation.Territory]: (
    <IconInTerritory color="var(--black)" />
  ),
  [FieldServiceMeetingLocation.Online]: <IconConference color="var(--black)" />,
};

export const getLocationIcon = (
  location: FieldServiceMeetingLocation,
  color?: string
): ReactElement<{ color?: string }> => {
  const icon = locationIconMap[location] ?? <IconAtHome color="var(--black)" />;
  return color ? cloneElement(icon, { color }) : icon;
};
