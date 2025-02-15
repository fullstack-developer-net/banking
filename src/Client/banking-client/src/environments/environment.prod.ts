import packageInfo from '../../package.json';

export const environment = {
  production: true,
  apiUrl: 'https://simple-banking.azurewebsites.net',
  webSocketUrl: 'https://simple-banking.azurewebsites.net/eventhub',
  appVersion: packageInfo.version
};
