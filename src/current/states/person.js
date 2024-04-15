import { atom, selector } from 'recoil';

export const isStudentDeleteState = atom({
  key: 'isStudentDelete',
  default: false,
});

export const isStudentAddState = atom({
  key: 'isStudentAdd',
  default: false,
});

export const isStudentEditState = atom({
  key: 'isStudentEdit',
  default: false,
});

export const isStudentDetailsOpenState = selector({
  key: 'isStudentDetailsOpen',
  get: ({ get }) => {
    const isAdd = get(isStudentAddState);
    const isEdit = get(isStudentEditState);

    let isDetailOpen = true;

    if (!isAdd && !isEdit) {
      isDetailOpen = false;
    }

    return isDetailOpen;
  },
});

export const currentStudentState = atom({
  key: 'currentStudent',
  default: {},
});
