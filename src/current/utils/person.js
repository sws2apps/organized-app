export const generateDisplayName = (name) => {
  if (name === '') {
    return '';
  }

  const txtArray = name.split(' ');
  if (txtArray.length === 1) {
    return name;
  }

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
