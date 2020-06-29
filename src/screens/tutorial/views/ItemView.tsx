import React from 'react';
import {StyleSheet, Image, ImageSourcePropType} from 'react-native';
import {Text} from 'components';
import {useI18n} from '@shopify/react-i18n';

import {TutorialKey} from '../TutorialContent';

interface ItemViewProps {
  item: TutorialKey;
  image: ImageSourcePropType;
}

export const ItemView = ({item, image}: ItemViewProps) => {
  const [i18n] = useI18n();
  return (
    <>
      <Image style={styles.image} source={image} accessibilityLabel={i18n.translate(`Tutorial.${item}AltText`)} />
      <Text variant="bodyTitle" color="overlayBodyText" marginBottom="l" accessibilityRole="header">
        {i18n.translate(`Tutorial.${item}Title`)}
      </Text>
      <Text variant="bodyText" color="overlayBodyText">
        {i18n.translate(`Tutorial.${item}`)}
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 273,
    marginBottom: 30,
    resizeMode: 'contain',
  },
});
