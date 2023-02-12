import { atom, selector } from 'recoil';
import { sourceLangState } from './main';

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
    const sourceLang = get(sourceLangState);
    const assTypeList = get(assTypeListState);

    let newList = [];
    for (let i = 0; i < assTypeList.length; i++) {
      let obj = {};
      obj.value = assTypeList[i].code;
      obj.label = assTypeList[i].assignment_type_name[sourceLang.toUpperCase()];
      newList.push(obj);
    }

    return newList;
  },
});

export const assTypeLocalNewState = selector({
  key: 'assTypeLocalNew',
  get: ({ get }) => {
    const sourceLang = get(sourceLangState);
    const assTypeList = get(assTypeListState);

    let newList = [];
    for (let i = 0; i < assTypeList.length; i++) {
      let obj = {};
      obj.value = assTypeList[i].code;
      obj.assignable = assTypeList[i].assignable;
      obj.maleOnly = assTypeList[i].maleOnly;
      obj.label = assTypeList[i].assignment_type_name[sourceLang.toUpperCase()];
      obj.type = assTypeList[i].type;
      obj.linkTo = assTypeList[i].linkTo;
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
    const newList = assTypeList
      .filter((ass) => ass.type === 'ayf')
      .sort((a, b) => {
        return a.code > b.code ? 1 : -1;
      });
    const final = newList.map((list) => {
      return { label: list.label, value: list.value };
    });

    return final;
  },
});

export const weekTypeLocalState = selector({
  key: 'weekTypeLocal',
  get: ({ get }) => {
    const sourceLang = get(sourceLangState);
    const weekTypeList = get(weekTypeListState);

    const newList = [];
    weekTypeList.forEach((weekType) => {
      const obj = {};
      obj.value = weekType.id_week_type;
      obj.sort_index = weekType.sort_index;
      obj.label = weekType.week_type_name[sourceLang.toUpperCase()];
      newList.push(obj);
    });

    newList.sort((a, b) => {
      return a.sort_index > b.sort_index ? 1 : -1;
    });

    return newList;
  },
});
