const path = process.env.URI_PATH || '/';
const domain = process.env.SERVER_STATUS_DOMAIN || 'localhost';
const scheme = process.env.SCHEME || 'https';

const url = `${scheme}://${domain}${path}`;

export default {
  port: process.env.PORT || 3100,
  path,
  domain,
  scheme,
  url,
  siteTitle: process.env.SITE_TITLE || 'Your service',
};
