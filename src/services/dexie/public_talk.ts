import { getI18n } from 'react-i18next';
import { getListLanguages } from '@services/app';
import { PublicTalkType } from '@definition/public_talks';
import appDb from '@db/appDb';

export const dbPublicTalkUpdate = async () => {
  const result: PublicTalkType[] = [];

  const languages = await getListLanguages();

  for (const lang of languages) {
    const langCode = lang.code.toUpperCase();

    const resource = getI18n().options.resources[lang.locale];

    if (!resource) continue;

    const translations = resource.talks;

    if (!translations) continue;

    for (const [key, value] of Object.entries(translations)) {
      const number = +key.split('_')[2];

      const findTalk = result.find((record) => record.talk_number === number);

      if (findTalk) {
        findTalk.talk_title[langCode] = value;
      }

      if (!findTalk) {
        result.push({ talk_number: number, talk_title: { [langCode]: value } });
      }
    }
  }

  await appDb.public_talks.clear();
  await appDb.public_talks.bulkPut(result);
};
