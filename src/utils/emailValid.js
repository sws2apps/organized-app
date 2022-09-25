/* eslint-disable no-useless-escape */

export const isEmailValid = (email) => {
	const emailRegex =
		/^([A-Za-z\d\.\-\_]+)@([A-Za-z\d-]+)\.([A-Za-z]{2,6})(\.[A-Za-z]{2,6})?$/;

	return emailRegex.test(email);
};
