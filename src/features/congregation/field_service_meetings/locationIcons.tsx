import { type ReactElement, cloneElement } from 'react';
import {
  IconAtHome,
  IconConference,
  IconCongregation,
  IconInTerritory,
} from '@components/icons';
import { FieldServiceMeetingLocation } from '@definition/field_service_meetings';

/**
 * Maps location types to their corresponding icons
 * Shared across meeting form and meeting display
 */
export const locationIconMap: Record<
  FieldServiceMeetingLocation,
  ReactElement
> = {
  [FieldServiceMeetingLocation.Publisher]: <IconAtHome color="var(--black)" />,
  [FieldServiceMeetingLocation.KingdomHall]: (
    <IconCongregation color="var(--black)" />
  ),
  [FieldServiceMeetingLocation.Territory]: (
    <IconInTerritory color="var(--black)" />
  ),
  [FieldServiceMeetingLocation.Zoom]: <IconConference color="var(--black)" />,
};

/**
 * Get the icon component for a given location
 */
export const getLocationIcon = (
  location: FieldServiceMeetingLocation,
  color?: string
): ReactElement => {
  const icon = locationIconMap[location] ?? <IconAtHome />;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return color ? cloneElement(icon, { color } as any) : icon;
};
