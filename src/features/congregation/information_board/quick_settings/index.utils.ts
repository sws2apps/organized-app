export const labelIsCorrect = (value: string) => {
  return value.length < 25;
};

export const linkIsCorrect = (value: string) => {
  const link = value.trim();

  if (!link) {
    return true;
  }

  try {
    const url = new URL(/^https?:\/\//i.test(link) ? link : `https://${link}`);

    if (!['http:', 'https:'].includes(url.protocol)) {
      return false;
    }

    if (!url.hostname) {
      return false;
    }

    const hostname = url.hostname.toLowerCase();

    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1'
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

export const getWebsiteName = (link: string): string => {
  link = link.trim();

  if (!link) return '';

  try {
    const url = new URL(/^https?:\/\//i.test(link) ? link : `https://${link}`);

    return url.hostname.replace(/^www\./, '').replaceAll('-', ' ');
  } catch {
    return link;
  }
};

export const getWebsiteURL = (link: string): string => {
  return /^https?:\/\//i.test(link) ? link : `https://${link}`;
};
