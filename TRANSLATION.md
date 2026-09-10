# Organized App translation guide

We use the collaborative localization platform Crowdin.com to work on different translations for the Organized app. All translated and approved content will be pushed to this repository automatically. So, you don't need to create any PRs with translation; it's handled automatically.

## How to start translating

1. View our [short video tutorial](https://www.youtube.com/watch?v=GG5q_NkfD6s) to learn how to localize Organized using Crowdin.
2. Open the [Organized](https://crowdin.com/project/organized) project in Crowdin. If you don't have an account, sign up.
3. Find your language and start translation.

Additionally, you can find more details and nuances in [Crowdin's guide for volunteer translators](https://support.crowdin.com/for-volunteer-translators/).

### Where are the English source strings?

If you've found a mistake or have a better suggestion for the English language: English sources can be found in [/locales/en](https://github.com/sws2apps/organized-app/tree/main/src/shared/locales/en). Please ensure that you are viewing the **correct desired branch**. If you find any problem with the source, please create a pull request with changes directly to `/locales/en`.
Crowdin automatically pulls all updates within 3 hours.

### My language is not yet available on Crowdin

Please create a [new issue](https://github.com/sws2apps/organized-app/issues/new?template=new_language_request.yml) in the Organized repository. We would be happy to add the new language so that you can start the translation work on Crowdin.

### What roles are available on Crowdin

For our translation project, we use two following roles: <br>
• _Translator_ – can suggest translations. Their suggestions require proofreading and approval. <br>
• _Proofreader_ – can suggest, approve, and proofread translations. They can correct and/or approve translations made by other translators.

If you are fluent in your language and would like to become a proofreader, please contact [sws2apps-admin manager on Crowdin](https://crowdin.com/messages/create/15663523/570305) (you can also find the contact button on the Crowding dashboard page).

### Translation files organization

The localization of this application is divided into different logical parts (files), depending on their use cases:

<img width="630" alt="Screenshot 2024-02-17 at 21 48 57" src="https://github.com/sws2apps/organized-app/assets/80993061/46a36a56-8af8-485e-9347-6f6a8ce9b07a">

These files vary in size (number of text strings), so choose the one that feels more comfortable for you to start and work on.

## What's New Workflow

This guide explains how to create and update **What's New** content for Organized.

### Source of the content

The English What's New content is stored in: `src/locales/en/release_notes.json`

If you are a manager, you can also create or edit the English What's New strings **directly in Crowdin**.

The two workflows are therefore:

-   **Repository:** edit `release_notes.json` and let the normal Crowdin sync handle translations.
-   **Crowdin:** create or edit the English source strings directly in Crowdin.

### Release entries

What's New content is grouped by release date using a timestamp key, for example:

``` json
"2026-09-01T00:00": {
  "images": { ... },
  "improvements": { ... }
}
```

When adding content for a release that already has an entry, **update that existing entry**.

Do not create another date entry for the same release simply because additional improvements were identified.

### Images

Use `images` for major features or changes that benefit from a visual explanation.

An image item contains:

-   `src` --- URL of the image
-   `tr_title` --- short title
-   `tr_desc` --- short description

Example:

``` json
"images": {
  "img_01": {
    "src": "https://raw.githubusercontent.com/sws2apps/organized-app/refs/heads/main/src/assets/img/example.svg",
    "tr_title": "Example feature",
    "tr_desc": "Short description of the feature."
  }
}
```

Images should normally be added to: `src/assets/img/` and referenced using the raw GitHub URL.

#### When not to add an image

Do not create an image just to accompany a small fix or minor improvement.

For small changes, use an improvement note instead.

### Improvements

Use `improvements` for smaller changes, fixes, refinements, and other release notes that do not need a dedicated visual.

Example:

``` json
"improvements": {
  "tr_note_01": "First improvement",
  "tr_note_02": "Second improvement"
}
```

Keep notes:

-   short
-   user-facing
-   easy to translate
-   focused on the benefit or visible change
-   free of unnecessary implementation details

### Choosing between images and improvements

As a simple rule:

-   **Major/new feature →** image + title + description
-   **Small improvement or fix →** improvement note
-   **Several small changes →** multiple improvement notes in the same release entry

A release can contain both images and improvement notes.

### Adding content for an upcoming release

Add the What's New content **before the release whenever possible** so translators have time to translate it.

If more changes are added later:

1.  Find the existing release entry.
2.  Add the new image or improvement there.
3.  Do not create a second entry for the same release.
