import React from 'react';
import {useI18n} from 'locale';
import {Text, RoundedBox} from 'components';
import {ExposureStatusType, useExposureStatus} from 'services/ExposureNotificationService';
import {getUploadDaysLeft} from 'shared/date-fns';
import {pluralizeKey} from 'shared/pluralization';
import {useCachedStorage} from 'services/StorageService';
import {isRegionActive} from 'shared/RegionLogic';
import {useRegionalI18n} from 'locale/regional';
import {TEST_MODE} from 'env';

import {BaseHomeView} from '../components/BaseHomeView';
import {Tip} from '../components/Tip';
import {HomeScreenTitle} from '../components/HomeScreenTitle';

export const DiagnosedView = () => {
  const i18n = useI18n();
  const regionalI18n = useRegionalI18n();
  const {region} = useCachedStorage();
  const exposureStatus = useExposureStatus();

  let daysLeft: number;
  if (TEST_MODE && exposureStatus.type !== ExposureStatusType.Diagnosed) {
    daysLeft = 13;
  } else {
    if (exposureStatus.type !== ExposureStatusType.Diagnosed) return null;
    daysLeft = getUploadDaysLeft(exposureStatus.cycleEndsAt);
  }

  return (
    <BaseHomeView iconName="hand-thank-you-with-love" testID="diagnosed">
      <RoundedBox isFirstBox>
        <HomeScreenTitle>
          {i18n.translate('Home.DiagnosedView.Title')}
          {/* No exposure detected */}
        </HomeScreenTitle>
        {daysLeft < 1 ? null : (
          <>
            <Text testID="bodyText" variant="bodyText" color="bodyText" marginBottom="m">
              {i18n.translate(pluralizeKey('Home.DiagnosedView.Body1', daysLeft), {number: daysLeft})}
            </Text>
            <Text variant="bodyText" color="bodyText" marginBottom="m">
              {i18n.translate('Home.DiagnosedView.Body2')}
            </Text>
          </>
        )}
      </RoundedBox>

      {daysLeft < 1 ? null : (
        <>
          <RoundedBox isFirstBox>
            <Text variant="bodyText" color="bodyText" marginBottom="m">
              {i18n.translate('Home.DiagnosedView.Body3')}
            </Text>
            {isRegionActive(region, regionalI18n.activeRegions) ? <Tip /> : null}
          </RoundedBox>
        </>
      )}
    </BaseHomeView>
  );
};
