/* eslint-disable no-useless-escape */

export const isEmailValid = (email) => {
  let isValid = false;
  let isSupportedDomain = false;

  const disallowedDomains = ['jwpub.org', 'jw.org'];

  const emailRegex = /^([A-Za-z\d\.\-\_]+)@([A-Za-z\d-]+)\.([A-Za-z]{2,6})(\.[A-Za-z]{2,6})?$/;

  if (emailRegex.test(email)) {
    isValid = true;
    if (!disallowedDomains.includes(email.split('@')[1])) {
      isSupportedDomain = true;
    }
  }

  return { isValid, isSupportedDomain };
};
