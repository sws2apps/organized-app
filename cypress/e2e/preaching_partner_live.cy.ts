/// <reference types="cypress" />

// Run with VITE_APP_MODE=TEST VITE_PARTNER_LIVE=true and an isolated fixture API.
// The fixture API uses the real partner routes, signed Pocket sessions and Storage emulator.
const liveButton = (label: string) =>
  cy.contains('button, [role="button"]', new RegExp(label, 'i'));
const fixtureApi = 'http://localhost:4081/';

const publisher = (name: 'alice' | 'bob') =>
  cy.window().then(async (win) => {
    const load = win.Function('url', 'return import(url)');
    const [{ store }, app, settings, { default: db }] = await Promise.all([
      load('/src/states/index.ts'),
      load('/src/states/app.ts'),
      load('/src/states/settings.ts'),
      load('/src/indexedDb/appDb.ts'),
    ]);
    store.set(app.userIDState, '');
    const people = (await db.persons.toArray()).filter(
      (person) =>
        !person._deleted.value &&
        !person.person_data.archived?.value &&
        [
          ...person.person_data.publisher_baptized.history,
          ...person.person_data.publisher_unbaptized.history,
        ].some(
          (status) => !status._deleted && status.start_date && !status.end_date
        )
    );
    const actor = people[name === 'alice' ? 0 : 1].person_uid;
    await win.fetch(`${fixtureApi}__fixture/${name}/${actor}`, {
      method: 'POST',
      credentials: 'include',
    });
    const value = await db.app_settings.get(1);
    value.user_settings.account_type = 'pocket';
    value.user_settings.user_local_uid = actor;
    value.cong_settings.cong_id = 'partner-browser-fixture';
    value.cong_settings.data_sync.value = true;
    await db.app_settings.put(value);
    store.set(settings.settingsState, value);
    store.set(app.apiHostState, fixtureApi);
    store.set(app.userIDState, name);
  });

const online = (value: boolean) =>
  cy.window().then(async (win) => {
    Object.defineProperty(win.navigator, 'onLine', {
      configurable: true,
      get: () => value,
    });
    const load = win.Function('url', 'return import(url)');
    const [{ store }, app] = await Promise.all([
      load('/src/states/index.ts'),
      load('/src/states/app.ts'),
    ]);
    store.set(app.isOnlineState, value);
    win.dispatchEvent(new win.Event(value ? 'online' : 'offline'));
  });

describe('Find a partner live sharing', { testIsolation: false }, () => {
  before(() => {
    cy.viewport(1280, 900);
    cy.visit('/');
    liveButton('START TESTING').should('be.visible').click();
    liveButton('OK').should('be.visible').click();
    publisher('alice');
    cy.window().then((win) => {
      win.location.hash = '/find-a-preaching-partner/my-requests';
    });
    liveButton('New request').should('be.visible');
  });

  it('shares a created request between authenticated publishers and receives the arrangement notification', () => {
    liveButton('New request').click();
    cy.get('input[type="text"]').last().type('Live shared ministry request');
    liveButton('CREATE').click();
    cy.contains('Live shared ministry request').should('be.visible');
    cy.contains('Waiting to sync').should('not.exist');
    publisher('bob');
    cy.get('#preaching-partner-tab-congregation-requests').click();
    cy.contains('Live shared ministry request').should('be.visible');
    cy.get('button[aria-label^="Join:"]').first().click();
    cy.get('[role="dialog"]')
      .last()
      .contains('button', /^confirm$/i)
      .click();
    liveButton('NO, THANKS').click();
    cy.get('#preaching-partner-tab-my-requests').click();
    cy.contains('Arranged').should('be.visible');
    publisher('alice');
    cy.get('#preaching-partner-tab-my-requests').click();
    liveButton('Refresh requests').click();
    cy.contains('Arranged').should('be.visible');
    cy.contains('Live shared ministry request').should('be.visible');
    cy.window()
      .then(async (win) => {
        const load = win.Function('url', 'return import(url)');
        const [{ store }, { notificationsState }] = await Promise.all([
          load('/src/states/index.ts'),
          load('/src/states/notification.ts'),
        ]);
        return { store, notificationsState };
      })
      .should(({ store, notificationsState }) => {
        expect(
          store
            .get(notificationsState)
            .some(
              (notification) =>
                notification.title === 'A publisher joined your request'
            )
        ).to.equal(true);
      });
    cy.screenshot('partner-live-arranged', { capture: 'viewport' });
  });

  it('syncs cancellation and deletion to the other publisher', () => {
    cy.get('button[aria-label^="Cancel:"]').first().click();
    cy.get('[role="dialog"]')
      .last()
      .contains('button', /^cancel the arrangement$/i)
      .click();
    cy.contains('Arranged').should('not.exist');
    publisher('bob');
    cy.get('#preaching-partner-tab-congregation-requests').click();
    liveButton('Refresh requests').click();
    cy.contains('Live shared ministry request').should('be.visible');
    publisher('alice');
    cy.get('#preaching-partner-tab-my-requests').click();
    cy.get('button[aria-label^="Edit:"]').first().click();
    liveButton('DELETE').click();
    cy.get('[role="dialog"]')
      .last()
      .contains('button', /^delete$/i)
      .click();
    cy.contains('Live shared ministry request').should('not.exist');
    publisher('bob');
    cy.get('#preaching-partner-tab-congregation-requests').click();
    liveButton('Refresh requests').click();
    cy.contains('Live shared ministry request').should('not.exist');
  });

  it('keeps offline drafts scoped to their publisher and publishes them on reconnect', () => {
    publisher('alice');
    cy.get('#preaching-partner-tab-my-requests').click();
    online(false);
    liveButton('New request').click();
    cy.get('input[type="text"]').last().type('Offline draft for Alice');
    liveButton('CREATE').click();
    cy.contains('Offline draft for Alice').should('be.visible');
    cy.contains('Waiting to sync').should('be.visible');
    online(true);
    liveButton('Refresh requests').click();
    cy.contains('Waiting to sync').should('not.exist');
    publisher('bob');
    cy.get('#preaching-partner-tab-my-requests').click();
    cy.contains('Offline draft for Alice').should('not.exist');
    cy.get('#preaching-partner-tab-congregation-requests').click();
    liveButton('Refresh requests').click();
    cy.contains('Offline draft for Alice').should('be.visible');
    online(false);
    cy.get('button[aria-label^="Join:"]').first().should('be.disabled');
    online(true);
  });
});
