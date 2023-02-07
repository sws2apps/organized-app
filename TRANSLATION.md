# CPE App Translation Guide

## Get started

1. Open [Congregation Program for Everyone](https://crowdin.com/project/cpe-lmmo) project on Crowdin
2. Find your locale and start translation. Find more details in [guide for volunteer translators](https://support.crowdin.com/for-volunteer-translators/)

All translated and approved content will be pushed to this repo automatically. You don't need to create any PRs with translation.

Original source can be found in [/locales/en](https://github.com/sws2apps/lmm-oa-sws/tree/main/src/locales/en). If you find any problem with original source, please create a PR with changes directly to `/locales/en`. Crowdin automatically pull all updates within 3 hours.

### Translation files organization

The localization of this application is divided in two parts:

1. `ui.json` contains all the texts for the application UI.
2. `source.json` contains all the texts used for source materials, forms and templates.

You may decide to translate the `source.json` only to begin with, and if convenient, later you can translate the `ui.json`.

### I can't find my language on Crowdin

Please create a [new issue](https://github.com/sws2apps/lmm-oa-sws/issues/new?template=new_language_request.yml) in this repo. We would be happy to add the new language so that you can start the translation on Crowdin.