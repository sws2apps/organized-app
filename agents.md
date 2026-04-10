# AI Agent Instructions for Organized App

This document provides guidelines for AI agents working on the Organized app codebase.

## General Principles

- **Analyse and Adapt**: Your goal is to follow the existing code writing style. Always analyse the existing patterns before implementing changes.
- **Local-First Approach**: The goal of the app is to be local-first, enabling usage in the browser even without an internet connection.
- **Autosave Priority**: Entering data and changing settings should be instant whenever possible. Avoid extra clicks for "Save"; autosave is our priority.
- **Multi-Language Support**: The app is very multi-language. Keep in mind that translated strings might look way longer than in the original English. Ensure that UI elements are optimized for such cases.

## Branch Organization

We use the `main` branch for the Organized app development. You are encouraged to create your own branches featuring in the title either `feat` for new features, or `fix` for bug fixes or small UI improvements that don't change the functionality.

## Codebase Guidelines

### Analyse Before Implementing

Your goal is to follow the existing code writing style. Always analyse the existing codebase before introducing new patterns, utilities, or solutions. The project likely already has an established approach for what you're trying to do — reuse it instead of reinventing it.

### Use Existing Design System Components

The project has custom component wrappers under `@components/` (e.g. `Typography`, `TextField`, `Divider`, `Button`). Always use these instead of raw MUI components or plain HTML elements when a wrapper exists.

### Use Existing Constants

Check `src/constants/index.ts` for existing constant arrays and enums before writing inline conditionals or hardcoding values. Reusing shared constants prevents logic drift and bugs across the application.

### Use the Breakpoint System

Use the `useBreakpoints()` hook from `@hooks/index` for responsive logic.

### Use Path Aliases

The project uses TypeScript path aliases. Always use them instead of relative paths.

### Use Global Styles

The project defines CSS custom properties (variables) in `src/global/global.css` for colors, spacing, radii, typography, and more (e.g. `var(--accent-300)`, `var(--radius-xl)`, `var(--white)`). Always use these design tokens instead of hardcoding raw values.

## Contribution Requirements

- Focus on one item, feature, or task at a time, and work within a dedicated branch for that specific task. Check our [local environment setup guide](./LOCAL_ENVIRONMENT_SETUP.md) for a step-by-step guide on how to set up the local environment with both the frontend app and API backend for Organized.
- Make sure that your fork is in sync with the upstream repository ([Syncing a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)).

## Sending a Pull Request (PR)

**Before submitting a PR**, please make sure the following is done: test if the changes you are proposing are working correctly and check if the application build correctly.

**When your proposed changes are ready**:

- Create your PR, making sure the title and description follows the PR title convention below. Failure to set this accordingly will cause your pull request to be discarded.

## PR Title Convention

The PR title **must** follow the [conventional-changelog](https://github.com/semantic-release/semantic-release#commit-message-format) format. Use one of the following prefixes:

| Prefix            | When to use                               | Example                                                            |
| ----------------- | ----------------------------------------- | ------------------------------------------------------------------ |
| `fix(scope)`      | Bug fixes, UI improvements                | `fix(meetings): allow visiting speaker selection for special talk` |
| `feat(scope)`     | New features                              | `feat(reports): add attendance export to CSV`                      |
| `refactor(scope)` | Code refactoring without behavior changes | `refactor(utils): simplify date formatting logic`                  |
| `style(scope)`    | Formatting, styling, no logic changes     | `style(ui): adjust mobile attendance grid layout`                  |
| `perf(scope)`     | Performance improvements                  | `perf(api): cache source materials response`                       |

Common scopes: `meetings`, `reports`, `styles`, `api`, `auth`, `persons`, `settings`.

## PR Description Template

Use the following template for PR descriptions. **Delete any checkboxes or fixes # in cases where they are not relevant** to keep the description clean.

```markdown
# Description

Brief summary of the change. Reference the issue if applicable.

Fixes #(issue number if exists)

## Type of change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] This change requires a documentation update

# Checklist:

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] Any dependent changes have been merged and published in downstream modules
```
