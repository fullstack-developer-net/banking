import packageInfo from '../../package.json';

export const environment = {
  production: true,
  apiUrl: 'https://localhost:5000',
  appVersion: packageInfo.version
};
