import { atom } from "recoil";

export const userPersoCodeState = atom({
    key: 'userPersoCode',
    default: '',
})

export const isErrorPersoCodeState = atom({
    key: 'isErrorPersoCode',
    default: false,
})