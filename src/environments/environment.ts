export const environment = {
  production: false,
  // strapi: 'http://localhost:1337/api',
  strapi: 'https://myjourneytracker.up.railway.app/api',
  agenda: 'https://agenda3.azurewebsites.net/api',
  API_KEYS: import.meta.env['NG_APP_STRAPI_KEY'],
  OLD_AGENDA_API_VERSION: 'v1',
  NEW_AGENDA_API_VERSION: 'v2'
};