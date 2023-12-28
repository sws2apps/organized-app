import CryptoES from 'crypto-es';

export const generateKey = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => ('00' + b.toString(16)).slice(-2))
    .join('');
};

export const encryptData = (data, passphrase) => {
  data = JSON.stringify(data);
  const encryptedData = CryptoES.AES.encrypt(data, passphrase).toString();
  return encryptedData;
};

export const decryptData = (data, passphrase) => {
  const decryptedData = CryptoES.AES.decrypt(data, passphrase);
  const str = decryptedData.toString(CryptoES.enc.Utf8);
  const result = JSON.parse(str);

  return result;
};
