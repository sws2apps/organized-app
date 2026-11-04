import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  fieldServiceMeetingLabel,
  fieldServiceMeetingLocationLabel,
} from '../src/utils/field_service_meeting_labels';
import {
  FieldServiceMeetingCategory as Category,
  FieldServiceMeetingLocation as Location,
} from '../src/definition/field_service_meetings';

const labels: Record<string, string> = {
  tr_fieldServiceMeetingCategory_regular: 'Field service meeting',
  tr_fieldServiceMeetingCategory_joint: 'Joint meeting',
  tr_fieldServiceMeetingCategory_serviceOverseer: 'Service overseer visit',
  tr_group: 'Group',
  tr_allGroups: 'All groups',
};
const t = (key: string) => labels[key];
test('regular meeting labels preserve the group name', () => {
  assert.equal(
    fieldServiceMeetingLabel(
      {
        category: Category.RegularMeeting,
        group_id: 'a',
        groupName: ' English Group ',
      },
      t
    ),
    'English Group'
  );
});
test('a visit retains both its group and additional category', () => {
  assert.equal(
    fieldServiceMeetingLabel(
      {
        category: Category.ServiceOverseerMeeting,
        group_id: 'a',
        groupName: 'English Group',
      },
      t
    ),
    'English Group · Service overseer visit'
  );
});
test('a visit without a group explicitly includes all groups', () => {
  assert.equal(
    fieldServiceMeetingLabel({ category: Category.ServiceOverseerMeeting }, t),
    'All groups · Service overseer visit'
  );
});
test('a deleted group retains its scope instead of becoming all groups', () => {
  assert.equal(
    fieldServiceMeetingLabel(
      { category: Category.ServiceOverseerMeeting, group_id: 'deleted' },
      t
    ),
    'Group · Service overseer visit'
  );
});
test('joint meetings use the translated joint label', () => {
  assert.equal(
    fieldServiceMeetingLabel({ category: Category.JointMeeting }, t),
    'Joint meeting'
  );
});
test('every part of the visit label uses the requested translator', () => {
  assert.equal(
    fieldServiceMeetingLabel(
      { category: Category.ServiceOverseerMeeting },
      (key) => `fr:${key}`
    ),
    'fr:tr_allGroups · fr:tr_fieldServiceMeetingCategory_serviceOverseer'
  );
});

const locationLabels: Record<string, string> = {
  tr_videoconference: 'Videoconference',
  tr_fieldServiceMeetingLocation_kingdomHall: 'Kingdom Hall',
  tr_fieldServiceMeetingLocation_territory: 'Territory',
  tr_fieldServiceMeetingLocation_publisher: 'Publisher',
};
const locationT = (key: string) => locationLabels[key] ?? key;

test('entered online addresses remain plain information without link metadata', () => {
  assert.deepEqual(
    fieldServiceMeetingLocationLabel(
      { location: Location.Online, address: ' https://zoom.us/j/123456789 ' },
      locationT
    ),
    { address: 'https://zoom.us/j/123456789' }
  );
});
test('entered location URLs take precedence over the location type', () => {
  assert.deepEqual(
    fieldServiceMeetingLocationLabel(
      { location: Location.Territory, address: 'https://example.org/park' },
      locationT
    ),
    { address: 'https://example.org/park' }
  );
  assert.deepEqual(
    fieldServiceMeetingLocationLabel(
      {
        location: Location.Publisher,
        address: ' https://example.org/publisher-address ',
      },
      locationT
    ),
    { address: 'https://example.org/publisher-address' }
  );
});
test('physical and free-form location information remains printable', () => {
  assert.deepEqual(
    fieldServiceMeetingLocationLabel(
      { location: Location.KingdomHall, address: ' 123 Kingdom Hall St ' },
      locationT
    ),
    { address: '123 Kingdom Hall St' }
  );
  assert.deepEqual(
    fieldServiceMeetingLocationLabel(
      {
        location: Location.Online,
        address: 'Meeting ID 123 456 - Passcode 789',
      },
      locationT
    ),
    { address: 'Meeting ID 123 456 - Passcode 789' }
  );
});
test('only missing or whitespace-only addresses use the location type', () => {
  assert.deepEqual(
    fieldServiceMeetingLocationLabel(
      { location: Location.Publisher, address: '   ' },
      locationT
    ),
    { address: 'Publisher' }
  );
  assert.equal(
    fieldServiceMeetingLocationLabel(
      { location: Location.KingdomHall },
      locationT
    ).address,
    'Kingdom Hall'
  );
  assert.equal(
    fieldServiceMeetingLocationLabel({ location: Location.Online }, locationT)
      .address,
    'Videoconference'
  );
});
