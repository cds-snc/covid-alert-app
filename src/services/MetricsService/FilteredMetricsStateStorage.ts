import {SecureKeyValueStore} from './SecureKeyValueStorage';

const InstalledEventMarkerKeyValueUniqueIdentifier = 'A607DDBD-D592-4927-8861-DD1CCEDA8E76';
const OnboardedEventMarkerKeyValueUniqueIdentifier = '0429518A-9D4D-4EB2-A5A8-AEA985DEB1D7';

export interface FilteredMetricsStateStorage {
  markInstalledEventAsPublished(): Promise<void>;
  isInstalledEventPublished(): Promise<boolean>;

  markOnboardedEventShouldBePublished(): Promise<void>;
  shouldOnboardedEventBePublished(): Promise<boolean>;
  markOnboardedEventShouldNotBePublished(): Promise<void>;
}

export class DefaultFilteredMetricsStateStorage implements FilteredMetricsStateStorage {
  private keyValueStore: SecureKeyValueStore;

  constructor(secureKeyValueStore: SecureKeyValueStore) {
    this.keyValueStore = secureKeyValueStore;
  }

  markInstalledEventAsPublished(): Promise<void> {
    return this.keyValueStore.save(InstalledEventMarkerKeyValueUniqueIdentifier, 'true');
  }

  isInstalledEventPublished(): Promise<boolean> {
    return this.keyValueStore.retrieve(InstalledEventMarkerKeyValueUniqueIdentifier).then(result => {
      if (result) {
        return true;
      } else {
        return false;
      }
    });
  }

  markOnboardedEventShouldBePublished(): Promise<void> {
    return this.keyValueStore.save(OnboardedEventMarkerKeyValueUniqueIdentifier, 'true');
  }

  shouldOnboardedEventBePublished(): Promise<boolean> {
    return this.keyValueStore.retrieve(OnboardedEventMarkerKeyValueUniqueIdentifier).then(result => {
      if (result) {
        return Boolean(result);
      } else {
        return false;
      }
    });
  }

  markOnboardedEventShouldNotBePublished(): Promise<void> {
    return this.keyValueStore.save(OnboardedEventMarkerKeyValueUniqueIdentifier, 'false');
  }
}
