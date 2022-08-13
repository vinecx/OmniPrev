export interface ISettingsState {
  version: IVersionState;
  currentVersion: string;
}

export interface IVersionState {
  versionNumber: string;
  lastVerified: Date;
}
