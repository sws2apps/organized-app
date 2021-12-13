import { atom, selector } from "recoil";

export const isStudentDeleteState = atom({
    key: 'isStudentDelete',
    default: false,
})

export const isStudentAddState = atom({
    key: 'isStudentAdd',
    default: false,
})

export const isStudentEditState = atom({
    key: 'isStudentEdit',
    default: false,
})

export const isStudentDetailsOpenState = selector({
    key: 'isStudentDetailsOpen',
    get: ({ get }) => {
        console.log('selector')
        const isAdd = get(isStudentAddState);
        const isEdit = get(isStudentEditState);

        if (!isAdd && !isEdit) {
            return false;
        } else {
            return true;
        }
    },
})

export const currentStudentState = atom({
    key: 'currentStudent',
    default: {},
})