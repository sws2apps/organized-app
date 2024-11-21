import CryptoES from 'crypto-es';
import Dexie from 'dexie';

const useMigrate = () => {
  const generateKey = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);

    return Array.from(array)
      .map((b) => ('00' + b.toString(16)).slice(-2))
      .join('');
  };

  const encryptData = (data, passphrase) => {
    data = JSON.stringify(data);
    const encryptedData = CryptoES.AES.encrypt(data, passphrase).toString();
    return encryptedData;
  };

  const handleOpenApp = async () => {
    await Dexie.delete('cpe_sws');

    window.location.href = '/';
  };

  return { handleOpenApp, generateKey, encryptData };
};

export default useMigrate;
