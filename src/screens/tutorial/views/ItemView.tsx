import React, {useRef, useLayoutEffect} from 'react';
import {StyleSheet, Image, ImageSourcePropType, AccessibilityInfo, findNodeHandle} from 'react-native';
import {Text} from 'components';
import {useI18n} from '@shopify/react-i18n';

import {TutorialKey} from '../TutorialContent';
import {TextMultiline} from 'components/TextMultiline';

export interface ItemViewProps {
  item: TutorialKey;
  image: ImageSourcePropType;
  isActive: boolean;
}

export const ItemView = ({item, image, isActive}: ItemViewProps) => {
  const [i18n] = useI18n();
  const imageRef = useRef<any>();

  useLayoutEffect(() => {
    const tag = findNodeHandle(imageRef.current);
    if (isActive && tag) {
      AccessibilityInfo.setAccessibilityFocus(tag);
    }
  }, [isActive, item]);

  return (
    <>
      <Image
        ref={imageRef}
        style={styles.image}
        source={image}
        accessible
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
