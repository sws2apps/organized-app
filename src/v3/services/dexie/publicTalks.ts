import { promiseGetRecoil } from 'recoil-outside';
import appDb from '@shared/indexedDb/appDb';
import { TalkType } from '@definition/sources';
import { JWLangState } from '@states/app';

export const dbPublicTalksSave = async (talk_number: number, talk_title: string) => {
  let JWLang: string = await promiseGetRecoil(JWLangState);
  const talk = await appDb.public_talks.get(talk_number);

  let hasChange = true;
  JWLang = JWLang.toUpperCase();

  if (talk.talk_title[JWLang]?.title) {
    hasChange = talk_title !== talk.talk_title[JWLang].title;
  }

  if (hasChange) {
    const updateTalk: TalkType = {
      talk_number: talk.talk_number,
      talk_title: { ...talk.talk_title, [JWLang]: { title: talk_title, updatedAt: new Date().toISOString() } },
    };

    await appDb.public_talks.put(updateTalk);
  }
};

export const dbPublicTalksReset = async (talks: TalkType[]) => {
  for (const talk of talks) {
    let S34: TalkType;

    const findTalk = await appDb.public_talks.get(talk.talk_number);

    if (!findTalk) {
      S34 = {
        talk_number: talk.talk_number,
        talk_title: { E: { title: '', updatedAt: '' } },
      };
    }

    if (findTalk) {
      S34 = structuredClone(findTalk);
    }

    for (const [language, value] of Object.entries(talk.talk_title)) {
      const incomingTitle = value.title;
      const incomingModified = value.updatedAt;

      let hasChange = false;
      const currentModified = S34.talk_title[language]?.updatedAt || '';

      if (currentModified === '') hasChange = true;
      if (currentModified !== '') {
        const incomingDate = new Date(incomingModified);
        const currentDate = new Date(currentModified);

        if (incomingDate > currentDate) hasChange = true;
      }

      if (hasChange) {
        S34.talk_title = { ...S34.talk_title, [language]: { title: incomingTitle, updatedAt: incomingModified } };
        await appDb.public_talks.put(S34);
      }
    }
  }
};
