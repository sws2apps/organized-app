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

### Translating "What’s New" contents

"What’s New in this release" content displayed inside this application can also be localized. To learn more on how to do so, please read [this guide](https://github.com/sws2apps/.github/blob/main/docs/WHATSNEW.md).
