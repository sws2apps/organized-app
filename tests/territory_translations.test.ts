import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { test } from 'node:test';
import i18next from 'i18next';
import ts from 'typescript';

const root = fileURLToPath(new URL('../src/', import.meta.url));
const sourceFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    if (entry.name === '__tests__' || entry.name === 'mockData.ts') return [];
    return entry.isDirectory()
      ? sourceFiles(file)
      : /\.tsx?$/.test(file)
        ? [file]
        : [];
  });
const files = [
  ...sourceFiles(path.join(root, 'features/territories')),
  ...sourceFiles(path.join(root, 'pages/territories')),
  ...sourceFiles(path.join(root, 'pages/dashboard/territories')),
  ...sourceFiles(path.join(root, 'views/territories')),
  path.join(root, 'definition/territory.ts'),
];
const english: Record<string, string> = Object.assign(
  {},
  ...readdirSync(path.join(root, 'locales/en'))
    .filter((name) => name.endsWith('.json'))
    .map((name) =>
      JSON.parse(readFileSync(path.join(root, 'locales/en', name), 'utf8'))
    )
);

test('every territory translation key has an English fallback', () => {
  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    for (const key of source.match(/tr_[A-Za-z0-9_]+/g) ?? []) {
      assert.ok(english[key] || english[`${key}_other`], `${file}: ${key}`);
    }
  }
});

test('territory screens and print previews do not use English text as translation keys', () => {
  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    assert.doesNotMatch(source, /\btx\s*\(/, file);
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
    const visit = (node: ts.Node) => {
      if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === 't' &&
        node.arguments[0] &&
        ts.isStringLiteral(node.arguments[0])
      ) {
        assert.match(node.arguments[0].text, /^tr_/, file);
      }
      ts.forEachChild(node, visit);
    };
    visit(ast);
  }
});

test('translation keys are never stored as map, territory, or export IDs', () => {
  for (const file of files) {
    const ast = ts.createSourceFile(
      file,
      readFileSync(file, 'utf8'),
      ts.ScriptTarget.Latest,
      true
    );
    const visit = (node: ts.Node) => {
      if (
        ts.isPropertyAssignment(node) &&
        node.name.getText(ast) === 'id' &&
        ts.isStringLiteral(node.initializer)
      ) {
        assert.doesNotMatch(node.initializer.text, /^tr_/, file);
      }
      ts.forEachChild(node, visit);
    };
    visit(ast);
  }
});

const translator = async (language = 'eng') => {
  const i18n = i18next.createInstance();
  await i18n.init({
    lng: language,
    fallbackLng: 'eng',
    defaultNS: 'ui',
    resources: { eng: { ui: english } },
    interpolation: { escapeValue: false },
  });
  return i18n;
};

test('map URLs are not part of the translatable catalogue', () => {
  for (const [key, value] of Object.entries(english)) {
    if (key.startsWith('tr_territory'))
      assert.doesNotMatch(value, /^https?:\/\//, key);
  }
});

test('Combine keeps its label and colon for zero, one, and multiple neighbours', async () => {
  const i18n = await translator();
  for (const n of [0, 1, 2, 12]) {
    assert.equal(i18n.t('tr_territoryCombineCount', { n }), `Combine: ${n}`);
  }
});

test('bulk actions use the language plural rules', async () => {
  const i18n = await translator();
  assert.equal(
    i18n.t('tr_territoryShowCount', { count: 1 }),
    'Show 1 territory'
  );
  assert.equal(
    i18n.t('tr_territoryShowCount', { count: 2 }),
    'Show 2 territories'
  );
  assert.equal(
    i18n.t('tr_territoryAssignCount', { count: 0 }),
    'Assign 0 territories'
  );
  assert.equal(
    i18n.t('tr_territoryAssignCount', { count: 1 }),
    'Assign 1 territory'
  );
});

test('missing translations use English and newly loaded translations update the label', async () => {
  const i18n = await translator('deu');
  assert.equal(i18n.t('tr_territoryCombineCount', { n: 2 }), 'Combine: 2');
  i18n.addResource(
    'deu',
    'ui',
    'tr_territoryCombineCount',
    'Zusammenführen: {{n}}'
  );
  assert.equal(
    i18n.t('tr_territoryCombineCount', { n: 2 }),
    'Zusammenführen: 2'
  );
  await i18n.changeLanguage('eng');
  assert.equal(i18n.t('tr_territoryCombineCount', { n: 2 }), 'Combine: 2');
});
