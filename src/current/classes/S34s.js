import { publicTalksBuildList } from '../utils/public_talks';
import { Setting } from './Setting';

class S34sClass {
  constructor() {
    this.talks = [];
  }
}

S34sClass.prototype.sort = function () {
  this.talks.sort((a, b) => a.talk_number - b.talk_number);
};

S34sClass.prototype.loadAll = async function () {
  this.talks.length = 0;

  const language = Setting.source_lang;
  this.talks = await publicTalksBuildList(language);

  this.sort();
};

S34sClass.prototype.get = function (talk_number) {
  return this.talks.find((record) => record.talk_number === talk_number);
};

S34sClass.prototype.findLocal = function (talk_number) {
  const found = this.talks.find((talk) => talk.talk_number === talk_number);
  return found.talk_title;
};

export const S34s = new S34sClass();
