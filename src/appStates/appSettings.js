import { atom } from "recoil";

export const settingsState = atom({
    key: 'appSettings',
    default: {},
})

export const isAppLoadState = atom({
    key: 'isAppLoad',
    default: true,
})

export const apiHostState = atom({
    key: 'apiHost',
    default: '',
})

export const isAboutOpenState = atom({
    key: 'isAboutOpen',
    default: false,
})

export const isLoginOpenState = atom({
    key: 'isLoginState',
    default: false,
})

export const isLoggedState = atom({
    key: 'isLoggedState',
    default: false,
})

export const appLangState = atom({
    key: 'appLang',
    default: 'en',
})

export const uidUserState = atom({
    key: 'uidUser',
    default: '',
})

export const isCongConnectedState = atom({
    key: 'isCongConnected',
    default: false,
})

export const userPasswordState = atom({
    key: 'userPassowrd',
    default: '',
})