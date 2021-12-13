import Dexie from "dexie";

var userDb = new Dexie("locale_data");
userDb.version(1).stores(
    {
        preferences: "&id_pref, perso_code"
    }
);

userDb.on("populate", function() {
    userDb.preferences.add({
        id_pref: 1,
        perso_code: '',
    });
});

export default userDb;