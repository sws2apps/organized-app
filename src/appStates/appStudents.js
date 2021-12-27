import { atom } from "recoil";

export const allStudentsState = atom({
    key: 'allStudents',
    default: [],
})

export const filteredStudentsState = atom({
    key: 'filteredStudents',
    default: [],
})