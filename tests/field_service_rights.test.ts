import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const source = readFileSync(
  new URL(
    '../src/features/congregation/app_access/user_details/useUserDetails.tsx',
    import.meta.url
  ),
  'utf8'
);
const user = (roles: string[]) => ({
  id: 'self',
  profile: {
    user_local_uid: 'person',
    user_members_delegate: [],
    cong_role: roles,
    firstname: { value: 'Test' },
    lastname: { value: 'User' },
  },
});
const createHook = (
  acceptedRoles: string[],
  fail = false,
  missingUser = false
) => {
  let processing = false;
  let users = [user(['publisher'])];
  const updates: Record<string, unknown>[] = [];
  const module = {
    exports: {} as {
      default: () => {
        handleSaveDetails: (record: ReturnType<typeof user>) => Promise<void>;
      };
    },
  };
  const atoms = {
    congregationUsersState: 'users',
    isProcessingUserState: 'processing',
  };
  const stubs: Record<string, unknown> = {
    'react-router': { useParams: () => ({ id: 'self' }) },
    react: { useMemo: (fn: () => unknown) => fn() },
    jotai: {
      useAtom: (key: string) =>
        key === 'processing'
          ? [
              processing,
              (value: boolean) => {
                processing = value;
              },
            ]
          : [
              users,
              (value: typeof users) => {
                users = value;
              },
            ],
      useAtomValue: (key: string) =>
        key === 'userID' ? 'self' : { cong_settings: { responsabilities: {} } },
    },
    '@states/congregation': atoms,
    '@states/app': { userIDState: 'userID' },
    '@states/settings': { settingsState: 'settings' },
    '@services/api/congregation': {
      apiCongregationUserUpdate: async () => {
        if (fail) throw new Error('rejected');
        return missingUser ? [] : [user(acceptedRoles)];
      },
    },
    '@services/dexie/settings': {
      dbAppSettingsUpdate: async (value: Record<string, unknown>) => {
        updates.push(value);
      },
    },
    '@services/states/app': { displaySnackNotification: () => undefined },
    '@services/i18n/translation': { getMessageByCode: (key: string) => key },
    '@hooks/index': { useAppTranslation: () => ({ t: (key: string) => key }) },
  };
  runInNewContext(
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
    {
      exports: module.exports,
      structuredClone,
      require: (name: string) => {
        if (!(name in stubs)) throw new Error(`Unexpected import: ${name}`);
        return stubs[name];
      },
    }
  );
  return {
    hook: module.exports.default(),
    updates,
    processing: () => processing,
  };
};
test('a role not returned by the API cannot grant local scheduling rights', async () => {
  const context = createHook(['publisher']);
  await context.hook.handleSaveDetails(
    user(['publisher', 'field_service_schedule'])
  );
  assert.deepEqual(context.updates[0]['user_settings.cong_role'], [
    'publisher',
  ]);
});
test('a server-confirmed scheduling role is applied locally', async () => {
  const roles = ['publisher', 'field_service_schedule'];
  const context = createHook(roles);
  await context.hook.handleSaveDetails(user(roles));
  assert.deepEqual(context.updates[0]['user_settings.cong_role'], roles);
});
test('server-confirmed revocation removes local all-group rights', async () => {
  const context = createHook(['publisher']);
  await context.hook.handleSaveDetails(user(['publisher']));
  assert.deepEqual(context.updates[0]['user_settings.cong_role'], [
    'publisher',
  ]);
});
test('a rejected role update leaves local roles unchanged and clears processing', async () => {
  const context = createHook([], true);
  await assert.rejects(
    context.hook.handleSaveDetails(user(['field_service_schedule'])),
    /rejected/
  );
  assert.equal(context.updates.length, 0);
  assert.equal(context.processing(), false);
});

test('a response missing the edited user cannot grant local roles', async () => {
  const context = createHook([], false, true);
  await assert.rejects(
    context.hook.handleSaveDetails(user(['field_service_schedule'])),
    /error_app_generic-title/
  );
  assert.equal(context.updates.length, 0);
  assert.equal(context.processing(), false);
});
