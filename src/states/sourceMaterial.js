import { atom, selector } from 'recoil';
import { appLangState } from './main';

export const isImportJWOrgState = atom({
  key: 'isImportJWOrg',
  default: false,
});

export const isImportEPUBState = atom({
  key: 'isImportEPUB',
  default: false,
});

export const epubFileState = atom({
  key: 'epubFile',
  default: {},
});

export const isRerenderSourceState = atom({
  key: 'isRerenderSource',
  default: false,
});

export const yearsListState = atom({
  key: 'yearsList',
  default: [],
});

export const currentYearState = atom({
  key: 'currentYear',
  default: '',
});

export const currentWeekState = atom({
  key: 'currentWeek',
  default: '',
});

export const assTypeListState = atom({
  key: 'assTypeList',
  default: [],
});

export const weekTypeListState = atom({
  key: 'weekTypeList',
  default: [],
});

export const assTypeLocalState = selector({
  key: 'assTypeLocal',
  get: ({ get }) => {
    const appLang = get(appLangState);
    const assTypeList = get(assTypeListState);

    let newList = [];
    for (let i = 0; i < assTypeList.length; i++) {
      let obj = {};
      obj.value = assTypeList[i].code;
      obj.label = assTypeList[i].ass_type_name[appLang.toUpperCase()];
      newList.push(obj);
    }

    return newList;
  },
});

export const assTypeLocalNewState = selector({
  key: 'assTypeLocalNew',
  get: ({ get }) => {
    const appLang = get(appLangState);
    const assTypeList = get(assTypeListState);

    let newList = [];
    for (let i = 0; i < assTypeList.length; i++) {
      let obj = {};
      obj.value = assTypeList[i].code;
      obj.assignable = assTypeList[i].assignable;
      obj.maleOnly = assTypeList[i].maleOnly;
      obj.label = assTypeList[i].ass_type_name[appLang.toUpperCase()];
      obj.type = assTypeList[i].type;
      newList.push(obj);
    }

    return newList.sort((a, b) => {
      return a.type > b.type ? 1 : -1;
    });
  },
});

export const assTypeAYFOnlyState = selector({
  key: 'assTypeAYFOnly',
  get: ({ get }) => {
    const assTypeList = get(assTypeLocalNewState);
    const newList = assTypeList.filter((ass) => ass.type === 'ayf');
    const final = newList.map((list) => {
      return { label: list.label, value: list.value };
    });

    return final;
  },
});

export const weekTypeLocalState = selector({
  key: 'weekTypeLocal',
  get: ({ get }) => {
    const appLang = get(appLangState);
    const weekTypeList = get(weekTypeListState);

    let newList = [];
    for (let i = 0; i < weekTypeList.length; i++) {
      let obj = {};
      obj.value = weekTypeList[i].id_week_type;
      obj.label = weekTypeList[i].week_type_name[appLang.toUpperCase()];
      newList.push(obj);
    }

    return newList;
  },
});
