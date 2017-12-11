import settings from 'electron-settings';
import { SAVED_FRAMEWORK } from './renderer/actions/Inspector';

// set default persistent settings
// do it here because settings are kind of like state!
settings.defaults({
  [SAVED_FRAMEWORK]: 'java',
});

export default settings;
