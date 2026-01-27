/**
 * @type {import('semantic-release').GlobalConfig}
 */

export default {
  branches: ['main'],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        releaseRules: [
          { type: 'tweak', release: 'patch' },
          { type: 'flag', release: 'patch' },
        ],
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          types: [
            { type: 'fix', section: 'Bug Fixes' },
            { type: 'tweak', section: 'Smaller adjustments' },
            { type: 'perf', section: 'Performance Improvements' },
            { type: 'feat', section: 'Features' },
            { type: 'flag', section: 'Released behind flags' },
          ],
        },
      },
    ],
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'package-lock.json'],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    '@semantic-release/github',
  ],
};
