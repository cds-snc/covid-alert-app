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
  const bodyText = i18n.translate(`Tutorial.${item}`).split(/\n\n/g);
  return (
    <>
      <Image
        style={styles.image}
        source={image}
        accessible
        accessibilityLabel={i18n.translate(`Tutorial.${item}AltText`)}
      />
      <Text variant="bodyTitle" color="overlayBodyText" marginBottom="l" accessible accessibilityRole="header">
        {i18n.translate(`Tutorial.${item}Title`)}
      </Text>
      {bodyText.map(text => (
        <Text key={text} variant="bodyText" color="overlayBodyText" marginBottom="l">
          {text}
        </Text>
      ))}
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
