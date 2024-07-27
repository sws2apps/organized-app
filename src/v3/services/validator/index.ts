import isEmail from 'validator/lib/isEmail';

export const isEmailValid = (email: string): boolean => {
  return isEmail(email, { host_blacklist: ['jwpub.org', 'jw.org'] });
};
