export interface WrapperWizproOptions extends WrapperWizproModule {
  environment?: "development" | "production" | "sandbox",
  uikitVersion?: string
  skipLog?: boolean,
  skipCampaigns?: boolean,
}

export interface WrapperWizproModule {
  elementName: string;
  remoteEntry: string;
  exposedModule: string;
  type: 'module' | 'manifest' | 'script';
}
