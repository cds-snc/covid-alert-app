import React from 'react';
import {StyleSheet, Image, ImageSourcePropType} from 'react-native';
import {Text, TextMultiline} from 'components';
import {useI18n} from 'locale';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';

import {TutorialKey} from '../TutorialContent';

export interface ItemViewProps {
  item: TutorialKey;
  image: ImageSourcePropType;
  isActive: boolean;
}

export const ItemView = ({item, image, isActive}: ItemViewProps) => {
  const i18n = useI18n();
  const accessibilityAutoFocusRef = useAccessibilityAutoFocus(isActive);

  return (
    <>
      <Image
        accessible
        ref={accessibilityAutoFocusRef}
        style={styles.image}
        source={image}
        accessibilityLabel={i18n.translate(`Tutorial.${item}AltText`)}
      />
      <Text variant="bodyTitle" color="overlayBodyText" marginBottom="l" accessible accessibilityRole="header">
        {i18n.translate(`Tutorial.${item}Title`)}
      </Text>
      <TextMultiline
        text={i18n.translate(`Tutorial.${item}`)}
        variant="bodyText"
        color="overlayBodyText"
        marginBottom="l"
      />
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 189,
    marginBottom: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
