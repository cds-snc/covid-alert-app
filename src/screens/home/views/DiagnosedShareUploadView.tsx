import React from 'react';
import {useI18n} from 'locale';
import {Text} from 'components';
import {useRegionalI18n} from 'locale/regional';
import {ExposureStatusType, useExposureStatus} from 'services/ExposureNotificationService';
import {BaseHomeView} from '../components/BaseHomeView';
import { useStorage } from 'services/StorageService';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';
import {isRegionActive} from 'shared/RegionLogic';
import {TEST_MODE} from 'env';

import {Tip} from '../components/Tip';

//find a way to check if the user has uploaded the OTK but not shared yet.
export const DiagnosedShareUploadView = ({isBottomSheetExpanded}: {isBottomSheetExpanded: boolean}) => {
  const i18n = useI18n();
  const regionalI18n = useRegionalI18n();
  const {region} = useStorage();
  const exposureStatus = useExposureStatus();
  const autoFocusRef = useAccessibilityAutoFocus(!isBottomSheetExpanded);

  return (
    <BaseHomeView iconName="hand-reminder" testID="diagnosed">
      <Text focusRef={autoFocusRef} variant="bodyTitle" color="bodyText" marginBottom="m" accessibilityRole="header">
        {i18n.translate('Home.DiagnosedShareUploadView.Title')}
      </Text>

    </BaseHomeView>
  )
}
