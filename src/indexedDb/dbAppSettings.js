import appDb from './mainDb';

export const dbUpdateAppSettings = async (settingValue) => {
    await appDb.table("app_settings").update(1, {
        ...settingValue,
    });
};

export const dbGetAppSettings = async () => {
    const congData = await appDb.table("app_settings").get({"id": 1});
    return congData;
};