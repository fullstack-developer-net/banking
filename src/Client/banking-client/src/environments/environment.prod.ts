import packageInfo from '../../package.json';

export const environment = {
  production: true,
  apiUrl: 'https://simple-banking.azurewebsites.net',
  appVersion: packageInfo.version
};
