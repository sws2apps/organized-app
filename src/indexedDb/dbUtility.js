import Dexie from "dexie";
import { exportDB, importDB } from "dexie-export-import";
import download from "downloadjs";
import appDb from './mainDb';

export const initAppDb = async () => {
    await appDb.open();
};

export const deleteDb = async () => {
    const databases = await Dexie.getDatabaseNames();

    for(let i=0; i < databases.length; i++) {
        Dexie.delete(databases[i]);
    }
};

export const isDbExist = async () => {
    return new Promise((resolve, reject) => {
        Dexie.exists("lmm_oa").then(function(exists) {
            if (exists) {
                resolve(true);
            } else {
                resolve(false);
            }
        }).catch(function(error) {
            reject("error");
        })
    });;
};

export const isValidJSON = async (fileJSON) => {
    var isValid = false;
    const getJSON = () => {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.readAsText(fileJSON);
            reader.onload = () => resolve(JSON.parse(reader.result));
            reader.onerror = error => reject(error);
        });
    }

    const data = await getJSON();
    if (data.formatName === "dexie") {
        if (data.data.databaseName === "lmm_oa") {
            isValid = true;
        }
    }
    return isValid;
}

export const dbRestoreDb = async (fileJSON) => {    
    await appDb.close();
    await appDb.delete();
    await importDB(fileJSON);
};

export const dbExportDb = async () => {
    const blob = await exportDB(appDb);
    const convertBase64 = () => {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.readAsDataURL(blob); 
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const data = await convertBase64();
    const myKey = '';
    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(myKey);
    const encryptedData = cryptr.encrypt(data);

    const newBlob = new Blob([encryptedData], {type: 'text/csv'});

    download(newBlob, "lmm-oa.backup.db", "text/plain")
};

export const dbExportJsonDb = async () => {
    const blob = await exportDB(appDb);
    const convertBase64 = () => {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.readAsDataURL(blob); 
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    
    const data = await convertBase64();
    const myKey = '';
    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(myKey);
    const encryptedData = cryptr.encrypt(data);
    return encryptedData;
};