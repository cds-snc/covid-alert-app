import React from 'react';
import {Box, Text, TextMultiline} from 'components';
import {useI18n} from 'locale';
import {BulletPoint} from 'components/BulletPoint';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';

export const RegionNotCoveredView = () => {
  const i18n = useI18n();
  const autoFocusRef = useAccessibilityAutoFocus(true);
  const notCoveredList = [
    {listAccessibile: 'listStart', text: i18n.translate('DataUpload.NoCode.RegionNotCovered.Body2')},
    {listAccessibile: 'item', text: i18n.translate('DataUpload.NoCode.RegionNotCovered.Body3')},
    {listAccessibile: 'listEnd', text: i18n.translate('DataUpload.NoCode.RegionNotCovered.Body4')},
  ];
  return (
    <Box>
      <Text
        testID="noCodeHeader"
        focusRef={autoFocusRef}
        variant="bodyTitle"
        marginBottom="l"
        accessibilityRole="header"
      >
        {i18n.translate('DataUpload.NoCode.RegionNotCovered.Title')}
      </Text>
      <TextMultiline marginBottom="l" text={i18n.translate('DataUpload.NoCode.RegionNotCovered.Body')} />
      {notCoveredList.map(item => (
        <BulletPoint key={item.text} listAccessibile={item.listAccessibile} text={item.text} />
      ))}
    </Box>
  );
};
