/**
 * @type {import('semantic-release').GlobalConfig}
 */

export default {
  branches: [
    'main',
    {
      name: 'beta',
      prerelease: true,
    },
    {
      name: 'alpha',
      prerelease: true,
    },
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        releaseRules: [{ type: 'flag', release: 'patch' }],
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        writerOpts: {
          groupBy: 'type',
          commitGroupsSort: 'title',
          commitsSort: ['scope', 'subject'],
          commitGroups: [
            {
              title: 'Released behind flags',
              types: ['flag'],
            },
          ],
          transform: (commit, context) => {
            // Ensure the 'flag' type is included in the changelog
            if (commit.type === 'flag') {
              commit.type = 'Released behind flags';
            }
            return commit;
          },
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
        assets: ['package.json', 'CHANGELOG.md'],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    '@semantic-release/github',
  ],
};
