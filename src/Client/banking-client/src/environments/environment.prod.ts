import packageInfo from '../../package.json';

export const environment = {
  production: true,
  piUrl: 'https://simple-banking.azurewebsites.net',
  appVersion: packageInfo.version
};
