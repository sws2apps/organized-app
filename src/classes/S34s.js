import appDb from '../indexedDb/mainDb';
import { S34Class } from './S34';
import { Schedules } from './Schedules';
import { Setting } from './Setting';

class S34sClass {
  constructor() {
    this.talks = [];
  }
}

S34sClass.prototype.sort = function () {
  this.talks.sort((a, b) => {
    return a.talk_number > b.talk_number ? 1 : -1;
  });
};

S34sClass.prototype.loadAll = async function () {
  this.talks.length = 0;

  const talks = await appDb.public_talks.toArray();

  for (const talk of talks) {
    const S34 = new S34Class(talk.talk_number);
    await S34.loadDetails();
    this.talks.push(S34);
  }

  this.sort();
};

S34sClass.prototype.reset = async function (talks) {
  this.talks.length = 0;

  await appDb.public_talks.clear();

  for (const talk of talks) {
    const S34 = new S34Class(talk.talk_number);

    const titles = structuredClone(talk);
    delete titles.id;
    delete titles.talk_number;

    S34.talk_title = titles;

    await appDb.public_talks.add(S34);
    this.talks.push(S34);
  }

  this.sort();
  Schedules.buildTalkHistory();
};

S34sClass.prototype.getLocal = function () {
  const result = [];
  const lang = Setting.source_lang.toUpperCase();

  for (const talk of this.talks) {
    result.push({
      talk_number: talk.talk_number,
      talk_title: talk.talk_title[lang].title,
      talk_modified: talk.talk_title[lang].modified,
    });
  }

  return result;
};

S34sClass.prototype.get = function (talk_number) {
  return this.talks.find((record) => record.talk_number === talk_number);
};

S34sClass.prototype.findLocal = function (talk_number) {
  const talks = this.getLocal();
  const found = talks.find((talk) => talk.talk_number === talk_number);
  return found.talk_title;
};

export const S34s = new S34sClass();
