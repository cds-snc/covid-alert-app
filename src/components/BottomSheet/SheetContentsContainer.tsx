import React from 'react';
import {useI18n} from '@shopify/react-i18n';
import {TouchableHighlight} from 'react-native';

import {Box} from '../Box';
import {SystemStatus, useSystemStatus} from '../../services/ExposureNotificationService';

interface ContentProps {
  isExpanded: boolean;
  toggleExpanded: () => void;
  children?: React.ReactElement;
}

export const SheetContentsContainer = ({children, isExpanded, toggleExpanded}: ContentProps) => {
  const [i18n] = useI18n();
  const [systemStatus] = useSystemStatus();
  const content = (
    <Box backgroundColor="overlayBackground" minHeight="100%">
      <Box marginTop="l">{children}</Box>
    </Box>
  );

  if (isExpanded) {
    return content;
  }

  return (
    <TouchableHighlight
      onPress={toggleExpanded}
      accessibilityRole="button"
      accessibilityLabel={
        systemStatus === SystemStatus.Active
          ? i18n.translate('BottomSheet.OnStatus')
          : i18n.translate('BottomSheet.OffStatus')
      }
    >
      {content}
    </TouchableHighlight>
  );
};
