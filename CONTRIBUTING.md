# How to Contribute

Organized is a modern program for Jehovah’s Witnesses congregation, developped by the [Scheduling Workbox System (SWS2APPS)](https://github.com/sws2apps) team. Our main goal is to create a software that covers all the congregation needs and stands out with excellent user experience. If you're interested in collaborating, we're more than happy to receive support from you. This document makes the process for contributing clearer and answers some questions that you may have.

Please make sure that you have read the [code of conduct](https://github.com/sws2apps/organized-app/blob/main/CODE_OF_CONDUCT.md) before continuing.

## Semantic Versioning

This module follows semantic versioning. We release patch versions for bugfixes, minor versions for new features or non-essential changes, and major versions for any breaking changes. Every significant change is documented in the [changelog](https://github.com/sws2apps/organized-app/blob/main/CHANGELOG.md) file.

## Branch Organization

We use the `main` branch for the Organized app development. You are encouraged to create your own branches featuring in the title either `[FEAT]` for new features, or `[FIX]` for bug fixes or small UI improvements that don't change the functionality.
Flags are used to test new features. (**Note**: Feature flags is in process of being developped.)

## Bugs

### Known Issues and Report

We are using [GitHub Issues](https://github.com/sws2apps/organized-app/issues) to keep track of bugs fix, and changes to be made to the application. We keep a close eye on this and try to make it clear when we have an internal fix in progress. Before filing a new task, try to make sure your problem doesn’t already exist.

### Security Bugs

Please do not report security bugs in the public issues; go through the process outlined on the [Security Policy](https://github.com/sws2apps/organized-app/blob/main/SECURITY.md).

## Proposing a Change

If you intend to add new features or suggest major changes to this module, check first that your idea is not yet in our tracking issues list. If not, we recommend creating a new [discussion first](https://github.com/sws2apps/organized-app/discussions/categories/ideas). This lets us reach an agreement on your proposal before you put significant effort into it. After it has been approved, please create [new issue](https://github.com/sws2apps/organized-app/issues), and choose the correct template.

If you’re only fixing a bug, it’s fine to submit a pull request right away but we still recommend to file an issue detailing what you’re fixing. This is helpful in case we don’t accept that specific fix but want to keep track of the issue.

## Contribution Requirements

- Focus on one item, feature, or task at a time, and work within a dedicated branch for that specific task.
Check our [local environment setup guide](./LOCAL_ENVIRONMENT_SETUP.md) for a step-by-step guide on how to set up the local environment with both the [frontend app](https://github.com/sws2apps/organized-app) and [API backend](https://github.com/sws2apps/sws2apps-api) for Organized.
- Make sure that your fork is in sync with the upstream repository ([Syncing a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)).

## Sending a Pull Request (PR)

We are monitoring for pull requests. We will review your pull request and either merge it, request changes to it, or close it with an explanation. We’ll do our best to provide updates and feedback throughout the process.

**Before submitting a PR**, please make sure the following is done:

- Run `npm dev`, and test if the changes you are proposing are working correctly.
- Run `npm build`, to check if the application build correctly.

**When commiting your changes**, we recommend the following command to be run:

- Check again if your forked repository or your local copy is up to date with upstream. ([Syncing a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)).
- Resolve conflicts if any.
- Commit and push your changes to your forked repository.

**When your proposed changes are in the forked repository on GitHub**:

- Create your PR.
- Make sure the title follows the [conventional-changelog](https://github.com/semantic-release/semantic-release#commit-message-format) format, depending on what item or issue you have been working on. Failure to set this accordingly will cause your pull request to be discarded.

You will receive a notification and be informed when your PR is published on development, staging, or in production.
