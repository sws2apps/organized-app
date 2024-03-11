import { promiseGetRecoil } from 'recoil-outside';
import { getS34 } from '@services/cpe/publicTalks';
import { appDb } from '.';
import { S34Schema } from './schema';
import { TalkType } from '@definition/sources';
import { JWLangState } from '@states/app';

export const saveS34 = async (talk_number: number, talk_title: string) => {
  let JWLang: string = await promiseGetRecoil(JWLangState);
  const talk = await getS34(talk_number);

  let hasChange = true;
  JWLang = JWLang.toUpperCase();

  if (talk.talk_title[JWLang]?.title) {
    hasChange = talk_title !== talk.talk_title[JWLang].title;
  }

  if (hasChange) {
    const talkTitle = { ...talk.talk_title, [JWLang]: { title: talk_title, modified: new Date().toISOString() } };
    await appDb.public_talks.update(talk.talk_number, { ...talk, talk_title: talkTitle });
  }
};

export const resetS34s = async (talks: TalkType[]) => {
  for (const talk of talks) {
    let S34;

    S34 = await getS34(talk.talk_number);

    if (!S34) {
      S34 = structuredClone(S34Schema);
      S34.talk_number = talk.talk_number;
    }

    for (const [language, value] of Object.entries(talk.talk_title)) {
      const incomingTitle = value.title;
      const incomingModified = value.modified;

      let hasChange = false;
      const currentModified = S34.talk_title[language]?.modified || '';

      if (currentModified === '') hasChange = true;
      if (currentModified !== '') {
        const incomingDate = new Date(incomingModified);
        const currentDate = new Date(currentModified);

        if (incomingDate > currentDate) hasChange = true;
      }

      if (hasChange) {
        S34.talk_title = { ...S34.talk_title, [language]: { title: incomingTitle, modified: incomingModified } };
        await appDb.public_talks.put(S34);
      }
    }
  }
};
