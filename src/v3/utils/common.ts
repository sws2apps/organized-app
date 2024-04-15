export const convertStringToBoolean = (value) => {
  switch (value) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return false;
  }
};

export const countUnreadNotifications = ({ announcements, language = 'E' }) => {
  let count = 0;

  for (const announcement of announcements) {
    const findTitleIndex = announcement.title.findIndex((item) => item.language === language);
    let isRead = announcement.title[findTitleIndex].isRead;

    if (isRead) {
      const findBodyIndex = announcement.body.findIndex((item) => item.language === language);
      isRead = announcement.body[findBodyIndex].isRead;
    }

    if (!isRead) count++;
  }

  return count;
};

export const formatCongregationInfo = (name = '', number = '') => {
  let formatted = '';

  if (name !== '' && number !== '') {
    formatted = `${name} (${number})`;
  }
  return formatted;
};

export const matchIsNumeric = (text) => {
  return !isNaN(Number(text));
};

export const generateDisplayName = (lastname, firstname) => {
  if (lastname.length === 0) {
    return firstname;
  }

  if (firstname.length === 0) {
    return lastname;
  }

  const txtArray = String(`${lastname} ${firstname}`).split(' ');
  let varDisplay = '';
  for (let i = 0; i < txtArray.length; i++) {
    if (i === txtArray.length - 1) {
      varDisplay += txtArray[i];
    } else {
      varDisplay += txtArray[i].substring(0, 1) + '. ';
    }
  }
  return varDisplay;
};

export const createArray = (n) => Array.from({ length: n }, (_, b) => b);
