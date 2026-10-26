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
  tr_viewLocation: 'View location',
  tr_fieldServiceMeetingLocation_kingdomHall: 'Kingdom Hall',
};
const locationT = (key: string) => locationLabels[key] ?? key;

test('online exports label the conference instead of exposing the URL', () => {
  assert.deepEqual(
    fieldServiceMeetingLocationLabel(
      { location: Location.Online, address: ' https://zoom.us/j/123456789 ' },
      locationT
    ),
    { address: 'Videoconference', addressUrl: 'https://zoom.us/j/123456789' }
  );
});
test('location links are not mislabeled as video meetings', () => {
  assert.deepEqual(
    fieldServiceMeetingLocationLabel(
      { location: Location.Territory, address: 'https://example.org/park' },
      locationT
    ),
    { address: 'View location', addressUrl: 'https://example.org/park' }
  );
});
test('physical and free-form addresses remain readable plain text', () => {
  assert.deepEqual(
    fieldServiceMeetingLocationLabel(
      { location: Location.KingdomHall, address: ' 123 Kingdom Hall St ' },
      locationT
    ),
    { address: '123 Kingdom Hall St', addressUrl: undefined }
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
test('malformed and non-web URLs do not become PDF hyperlinks', () => {
  for (const address of [
    'https://',
    'javascript:alert(1)',
    'file:///private/meeting',
  ]) {
    assert.equal(
      fieldServiceMeetingLocationLabel(
        { location: Location.Online, address },
        locationT
      ).addressUrl,
      undefined
    );
  }
});
