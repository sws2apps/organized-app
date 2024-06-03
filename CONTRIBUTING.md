# How to Contribute

CPE is a program for Jehovah’s Witnesses congregation, developped by the [Scheduling Workbox System (SWS)](https://github.com/sws2apps) team. But we are also more than happy to receive support from those who are very intersted to assist us. Hopefully this document makes the process for contributing clear and answers some questions that you may have.

Please make sure that you have read the [code of conduct](https://github.com/sws2apps/cpe-sws/blob/main/CODE_OF_CONDUCT.md) before continuing.

## Semantic Versioning

This module follows semantic versioning. We release patch versions for bugfixes, minor versions for new features or non-essential changes, and major versions for any breaking changes. Every significant change is documented in the [changelog](https://github.com/sws2apps/cpe-sws/blob/main/CHANGELOG.md) file.

## Branch Organization

We use only the `main` branch. But flags are used to test new features. (**Note**: Feature flags is in process of being developped.)

## Bugs

### Known Issues and Report

We are using [GitHub Issues](https://github.com/sws2apps/cpe-sws/issues) to keep track of bugs fix, and changes to be made to the application. We keep a close eye on this and try to make it clear when we have an internal fix in progress. Before filing a new task, try to make sure your problem doesn’t already exist.

### Security Bugs

Please do not report security bugs in the public issues; go through the process outlined on the [Security Policy](https://github.com/sws2apps/cpe-sws/blob/main/SECURITY.md).

## Proposing a Change

If you intend to add new features or suggest major changes to this module, check first that your idea is not yet in our tracking issues list. If not, we recommend creating a new [discussion first](https://github.com/sws2apps/cpe-sws/discussions/categories/ideas). This lets us reach an agreement on your proposal before you put significant effort into it. After it has been approved, please create [new issue](https://github.com/sws2apps/cpe-sws/issues), and choose the correct template.

If you’re only fixing a bug, it’s fine to submit a pull request right away but we still recommend to file an issue detailing what you’re fixing. This is helpful in case we don’t accept that specific fix but want to keep track of the issue.

## Contribution Prerequisites

- You have the latest version of [Node](https://nodejs.org) and [Git](https://git-scm.com) installed
- You will be working on one item at a time.
- If you do not have it yet, fork the repository. Clone it if you will work locally.
- If you have already forked and clone the repository, make sure that it is in sync with the upstream repository ([Syncing a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)).
- Local backend server already setup and running. (This API backend is needed before running this project. The instructions on how to setup this API locally can be found [here](https://github.com/sws2apps/sws2apps-api/blob/main/CONTRIBUTING.md).)
- Run `npm i` to install the needed dependencies

### Setup Environment Variables

You will get the values for the following environment from the Firebase project you created when you set up the local backend server.

- VITE_FIREBASE_APIKEY: your Firebase apiKey defined in the Firebase Console.
- VITE_FIREBASE_AUTHDOMAIN: your Firebase authDomain defined in the Firebase Console.
- VITE_FIREBASE_PROJECTID: your Firebase projectId defined in the Firebase Console.
- VITE_FIREBASE_APPID: your Firebase appId defined in the Firebase Console.
- VITE_FIREBASE_MEASUREMENTID: your Firebase measurementId defined in the Firebase Console.

### Starting the Development Server

Open a terminal and run `npm run dev` to start the development server, and start using the local version of CPE.

## Coding Rules

This section provides guidelines for writing clean, consistent, and maintainable code, covering naming conventions, code structure, documentation, error handling, and performance. Adhering to these rules ensures high-quality, reliable software.

### Writing Documentation

Quality documentation is crucial for the success of any development project. It facilitates teamwork, maintenance, and product evolution. This section covers key principles and best practices for writing effective documentation.

Since technology doesn't stand still these days, you can use this prompt for chatgpt to write documentation.

```plaintext
ChatGPT Documentation Prompt

When documenting ChatGPT code, it's crucial to provide clear and comprehensive information about each function, method, and class. This ensures that the code is understandable and maintainable. Follow these guidelines to document your ChatGPT TypeScript code effectively:

1. Function or Method Documentation:
   - Description: Provide a brief but detailed description of what the function or method does.
   - @param: For each parameter, describe the type and purpose.
   - @returns: Describe the return value and its type, if applicable.
   - @example: Include an example of how to use the function or method.

2. Class Documentation:
   - Description: Provide an overview of the class, its purpose, and how it should be used.
   - @property: For each property, describe the type and purpose.

Example Documentation:

Function Documentation:

/**
 * Adds two numbers together.
 *
 * @param {number} a - The first number to add.
 * @param {number} b - The second number to add.
 * @returns {number} The sum of the two numbers.
 * @example
 * // Example usage:
 * // Returns 3
 * add(1, 2);
 */
function add(a: number, b: number): number {
    return a + b;
}

Class Documentation:

/**
 * Represents a point in 2D space.
 *
 * @class
 */
class Point {
    /**
     * Creates a new Point.
     *
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     */
    constructor(private x: number, private y: number) {}

    /**
     * Gets the x-coordinate.
     *
     * @returns {number} The x-coordinate.
     */
    getX(): number {
        return this.x;
    }

    /**
     * Gets the y-coordinate.
     *
     * @returns {number} The y-coordinate.
     */
    getY(): number {
        return this.y;
    }

    /**
     * Moves the point by a given delta.
     *
     * @param {number} dx - The delta to move in the x-direction.
     * @param {number} dy - The delta to move in the y-direction.
     * @example
     * const point = new Point(1, 2);
     * point.move(3, 4);
     * // Now point is at (4, 6)
     */
    move(dx: number, dy: number): void {
        this.x += dx;
        this.y += dy;
    }
}

Best Practices:
- Clarity: Ensure that descriptions are clear and concise.
- Consistency: Use the same terminology and structure across all documentation.
- Examples: Provide examples that cover common use cases and edge cases where relevant.
- Type Annotations: Always specify the types of parameters and return values to leverage TypeScript's type-checking capabilities.

By following this guide, you can create documentation that is both informative and easy to understand, making your ChatGPT TypeScript code more maintainable and accessible to other developers.

```

!PLEASE DO NOT USE CHATGPT TO WRITE CODE, USE ONLY IN THE MOST SEVERE CASES, BETTER ASK THE DEVELOPER COMMUNITY!

### Code decoration

For seperate code recomended use [comment-divider](https://github.com/stackbreak/comment-divider).

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
