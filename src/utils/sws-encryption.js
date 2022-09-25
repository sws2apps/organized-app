import SimpleCrypto from 'simple-crypto-js';

export const encryptString = async (secret, payload) => {
	const simpleCrypto = new SimpleCrypto(secret);
	const encrypted = await simpleCrypto.encrypt(payload);
	return encrypted;
};

export const decryptString = async (secret, payload) => {
	try {
		const simpleCrypto = new SimpleCrypto(secret);
		const decrypted = await simpleCrypto.decrypt(payload);
		return decrypted;
	} catch (err) {
		return err.message;
	}
};
