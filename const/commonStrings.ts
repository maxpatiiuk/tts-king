import { LocalizationStrings } from '../lib/languages';

const commonLocalizationStrings: LocalizationStrings<{
  yes: string,
  no: string,
  add: string,
  delete: string,
  confirmDelete: string,
  cancelDelete: string,
  profile: string,
  dashboard: string,
  signOut: string,
  sources: string,
}> = {
  'en-US': {
    yes: 'Yes',
    no: 'No',
    add: 'Add',
    delete: 'Delete',
    confirmDelete: 'Yes, delete',
    cancelDelete: 'No, don\'t delete',
    profile: 'Profile',
    dashboard: 'Dashboard',
    signOut: 'Sign out',
    sources: 'Sources',
  },
};

export default commonLocalizationStrings;