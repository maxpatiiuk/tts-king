import type { LocalizationStrings } from '../lib/languages';

const commonLocalizationStrings: LocalizationStrings<{
  readonly yes: string;
  readonly no: string;
  readonly add: string;
  readonly delete: string;
  readonly confirmDelete: string;
  readonly cancelDelete: string;
  readonly profile: string;
  readonly dashboard: string;
  readonly signOut: string;
  readonly sources: string;
}> = {
  'en-US': {
    yes: 'Yes',
    no: 'No',
    add: 'Add',
    delete: 'Delete',
    confirmDelete: 'Yes, delete',
    cancelDelete: "No, don't delete",
    profile: 'Profile',
    dashboard: 'Dashboard',
    signOut: 'Sign out',
    sources: 'Sources',
  },
};

export default commonLocalizationStrings;
