# How to Contribute
LMM-OA is one of the applications developped by the [Scheduling Workbox System (SWS)](https://github.com/sws2apps) team. But we are also more than happy to receive support from those who are very intersted to assist us. Hopefully this document makes the process for contributing clear and answers some questions that you may have.

Please make sure that you have read the [code of conduct](https://github.com/sws2apps/lmm-oa-sws/blob/main/CODE_OF_CONDUCT.md) before continuing.

## Semantic Versioning
LMM-OA follows semantic versioning. We release patch versions for bugfixes, minor versions for new features or non-essential changes, and major versions for any breaking changes. Every significant change is documented in the [changelog](https://github.com/sws2apps/lmm-oa-sws/blob/main/CHANGELOG.md) file.

## Branch Organization
We used three different branches to make production, beta and alpha releases of LMM-OA:

| branch | whats for |
| :----- | :-------- |
| main   | making production release of LMM-OA: bug fix for the current version will be queued in this branch |
| beta   | making beta release of LMM-OA: new feature will be queued in this branch |
| alpha  | making beta release of LMM-OA: breaking change will be queued in this branch |

## Bugs

### Known Issues and Report
We are using [GitHub Issues](https://github.com/sws2apps/lmm-oa-sws/issues) to keep track of bugs fix. We keep a close eye on this and try to make it clear when we have an internal fix in progress. Before filing a new task, try to make sure your problem doesn’t already exist.

### Security Bugs
Please do not report security bugs in the public issues; go through the process outlined on the [Security Policy](https://github.com/sws2apps/lmm-oa-sws/blob/main/SECURITY.md).

## Proposing a Change
If you intend to add new features or suggest major changes to LMM-OA, we recommend filing an [issue first](https://github.com/sws2apps/lmm-oa-sws/issues). This lets us reach an agreement on your proposal before you put significant effort into it.

If you’re only fixing a bug, it’s fine to submit a pull request right away but we still recommend to file an issue detailing what you’re fixing. This is helpful in case we don’t accept that specific fix but want to keep track of the issue.

## Contribution Prerequisites
- You have the latest version of [Node](https://nodejs.org) and [Git](https://git-scm.com) installed

## Sending a Pull Request (PR)
We are monitoring for pull requests. We will review your pull request and either merge it, request changes to it, or close it with an explanation. We’ll do our best to provide updates and feedback throughout the process.

**Before submitting a PR**, please make sure the following is done:
1. Fork the repository and clone it locally.
2. Start working in the appropriate branch, depending on what you are suggesting:
   - `main`, if you want to suggest a bug fix for the current version released in production.
   - `beta`, if you want to suggest a new feature.
   - `alpha`, if you want to suggest breaking change.
3. If you have clonned the forked repository, fetch and merge first from upstream to origin, and from origin to your local repository. Make sure to resolve any conflicts before starting your work.
4. Setup the environment variable .env. To get the right values, contact one of the developers contributing to this project. If you want, you can create your own values as well while you are working.
5. Run `npm i` in your local branch.
6. Run `npm run start` to make sure that the code is compiled successfully.
7. Test your changes to make sure that they are working as intended.

**When commiting your changes**, we recommend the following commands to be run:
1. Run `git add .`
2. Run `npm run ghcommit` to start the [commitizen cli](https://github.com/commitizen/cz-cli#using-the-command-line-tool). Make sure that you’ve set your changes accordingly. Failure to set this accordingly will cause your pull request on the release branch to be discarded.
3. Fetch and merge from upstream to origin, and from origin to your local repository. Make sure to resolve any conflicts.
4. Run `git push`

**When your proposed changes are in the forked repository on GitHub**:
1. Create your PR.
2. Make sure the title follows the [conventional-changelog](https://github.com/semantic-release/semantic-release#commit-message-format) format.

You will receive a notification and be informed when your PR is published on beta, or in production.
